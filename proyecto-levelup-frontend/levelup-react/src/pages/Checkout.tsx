import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutFormulario from "../components/Checkout/CheckoutFormulario";
import CheckoutResumen from "../components/Checkout/CheckoutResumen";
import CheckoutPago from "../components/Checkout/CheckoutPago";
import CheckoutRapido from "../components/Checkout/CheckoutRapido";
import CompraExitosa from "../components/Checkout/CompraExitosa";
import CompraFallida from "../components/Checkout/CompraFallida";
import { getCarrito, vaciarCarrito } from "../logic/carrito";
import { ProductoEnCarrito } from "../logic/storage";
import { UsuarioService } from "../services/api/usuario";
import {
  DatosEnvio,
  OrdenCompra,
  crearOrdenCompra,
  procesarPago,
  guardarOrden,
  actualizarEstadoOrden,
  calcularValoresOrden,
  isDuocEmail,
  formatCLP,
} from "../utils/orden.helper";
import { generarPDFBoleta, enviarBoletaPorEmail } from "../utils/pdf.helper";
import {
  DatosEnvio as DatosEnvioHelper,
  DatosTarjeta,
  determinarSiguientePaso,
  guardarDatosEnvio,
  guardarDatosTarjeta,
  obtenerDatosEnvio,
  obtenerDatosTarjeta,
  limpiarDatosCheckout,
} from "../utils/checkout.helper";
import { saveSession } from "../logic/auth";

// ESTE CHECKOUT ES PARA LA PASARELA DE PAGO Y EL RESUMEN DE LA COMPRA

// Interfaces para el usuario logueado
interface User {
  id: string;
  nombre: string;
  apellidos?: string;
  apellido?: string;
  email: string;
  telefono?: string;
  direccion?: string;
  region?: string;
  comuna?: string;
  password?: string;
  fechaNacimiento?: string;
  genero?: string;
  referralCode?: string;
}

interface StoredSession {
  userId?: string | number;
  id?: string | number;
  displayName?: string;
  apellidos?: string;
  email?: string;
  region?: string;
  comuna?: string;
  telefono?: string;
  direccion?: string;
  duocMember?: boolean;
}

//definimos el tipo de dato que puede ser el paso del checkout para lograr un mejor control de los pasos
type CheckoutStep =
  | "formulario"
  | "resumen"
  | "pago"
  | "rapido"
  | "procesando"
  | "exitoso"
  | "fallido";

//definimos el componente Checkout
const Checkout: React.FC = (): React.JSX.Element => {
  //React.FC es el tipo de dato que puede ser el componente Checkout
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>("formulario"); //step es el paso actual del checkout osea formulacio etc
  const [productos, setProductos] = useState<ProductoEnCarrito[]>([]);
  const [datosEnvio, setDatosEnvio] = useState<DatosEnvio | null>(null);
  const [datosTarjeta, setDatosTarjeta] = useState<DatosTarjeta | null>(null);
  const [orden, setOrden] = useState<OrdenCompra | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<User | null>(null);
  const [error, setError] = useState<string>("");

  // Cargar datos iniciales es decir cuando se carga la pagina
  useEffect(() => {
    const init = async () => {
      await cargarDatosIniciales();
    };
    void init();
  }, []);

  async function cargarDatosIniciales(): Promise<void> {
    // Cargar productos del carrito
    const productosCarrito = getCarrito();
    if (productosCarrito.length === 0) {
      // Si no hay productos, redirigir al carrito
      navigate("/carrito");
      return;
    }
    setProductos(productosCarrito);

    // Cargar usuario logueado si existe
    let session = obtenerSesionLocal();

    if (!session) {
      session = await reconstruirSesionDesdeBackend();
    }

    if (!session) {
      alert("Debes iniciar sesión para proceder con la compra");
      navigate("/login");
      return;
    }

    const usuario = await obtenerUsuarioDesdeSesion(session);
    setUsuarioLogueado(usuario);

    // Verificar si el usuario está logueado
    if (!usuario) {
      // Si no está logueado, redirigir al login
      alert("Debes iniciar sesión para proceder con la compra");
      navigate("/login");
      return;
    }

    // Cargar datos guardados del checkout
    const datosEnvioGuardados = obtenerDatosEnvio();
    const datosTarjetaGuardados = obtenerDatosTarjeta();

    if (datosEnvioGuardados) {
      setDatosEnvio(datosEnvioGuardados);
    }

    if (datosTarjetaGuardados) {
      setDatosTarjeta(datosTarjetaGuardados);
    }

    // Determinar el paso inicial basado en los datos guardados
    const pasoInicial = determinarSiguientePaso();
    setStep(pasoInicial);

    console.log("Checkout inicializado:", {
      pasoInicial,
      tieneDatosEnvio: !!datosEnvioGuardados,
      tieneDatosTarjeta: !!datosTarjetaGuardados,
      usuarioLogueado: !!usuario,
    }); // Debug
  }

  function obtenerSesionLocal(): StoredSession | null {
    try {
      const session = localStorage.getItem("lvup_user_session");
      if (!session) return null;
      return JSON.parse(session) as StoredSession;
    } catch (error) {
      console.warn("No se pudo leer lvup_user_session", error);
      return null;
    }
  }

  async function obtenerUsuarioDesdeSesion(session: StoredSession): Promise<User | null> {
    const possibleId = session.userId ?? session.id;
    const userId = possibleId != null ? String(possibleId) : "";

    if (!userId) {
      return null;
    }

    // Revisar cache legacy
    try {
      const usersRaw = localStorage.getItem("lvup_users");
      if (usersRaw) {
        const users = JSON.parse(usersRaw) as User[];
        const storedUser = users.find((u) => String(u.id) === userId);
        if (storedUser) {
          return storedUser;
        }
      }
    } catch (error) {
      console.warn("No se pudo parsear lvup_users", error);
    }

    // Intentar obtener perfil desde API
    try {
      const perfilResponse = await UsuarioService.getPerfil();
      const perfil = perfilResponse.data;
      if (perfil) {
        const usuario: User = {
          id: perfil.id ? String(perfil.id) : userId,
          nombre: perfil.nombre ?? session.displayName ?? "Usuario",
          apellidos: perfil.apellidos ?? session.apellidos ?? "",
          apellido: perfil.apellidos ?? session.apellidos ?? "",
          email: perfil.correo ?? session.email ?? "",
          telefono: perfil.telefono ?? session.telefono ?? "",
          direccion: perfil.direccion ?? session.direccion ?? "",
          region: perfil.region ?? session.region ?? "",
          comuna: perfil.comuna ?? session.comuna ?? "",
          fechaNacimiento: perfil.fechaNacimiento ?? "",
          referralCode: perfil.codigoReferido ?? "",
        };
        try {
          const usersRaw = localStorage.getItem("lvup_users");
          const users = usersRaw ? JSON.parse(usersRaw) : [];
          const existingIndex = users.findIndex((u: any) => String(u.id) === usuario.id);
          if (existingIndex >= 0) {
            users[existingIndex] = { ...users[existingIndex], ...usuario };
          } else {
            users.push(usuario);
          }
          localStorage.setItem("lvup_users", JSON.stringify(users));
        } catch (cacheError) {
          console.warn("No se pudo actualizar lvup_users", cacheError);
        }
        return usuario;
      }
    } catch (error) {
      console.warn("No se pudo obtener el perfil desde la API", error);
    }

    // Fallback con la información disponible en sesión
    const usuarioFallback: User = {
      id: userId,
      nombre: session.displayName ?? "Usuario",
      apellidos: session.apellidos ?? "",
      apellido: session.apellidos ?? "",
      email: session.email ?? "",
      telefono: session.telefono ?? "",
      direccion: session.direccion ?? "",
      region: session.region ?? "",
      comuna: session.comuna ?? "",
    };
    // Guardar fallback para próximas consultas
    try {
      const usersRaw = localStorage.getItem("lvup_users");
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const existingIndex = users.findIndex((u: any) => String(u.id) === usuarioFallback.id);
      if (existingIndex >= 0) {
        users[existingIndex] = { ...users[existingIndex], ...usuarioFallback };
      } else {
        users.push(usuarioFallback);
      }
      localStorage.setItem("lvup_users", JSON.stringify(users));
    } catch (cacheError) {
      console.warn("No se pudo persistir el fallback de usuario", cacheError);
    }

    return usuarioFallback;
  }

  async function reconstruirSesionDesdeBackend(): Promise<StoredSession | null> {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return null;
    }

    try {
      const perfilResponse = await UsuarioService.getPerfil();
      const perfil = perfilResponse.data;
      if (!perfil) {
        return null;
      }

      const id = perfil.id ?? perfil.idUsuario;
      if (!id) {
        return null;
      }

      const displayName =
        (perfil.nombre ?? perfil.nombreUsuario ?? "Usuario")
          .toString()
          .split(" ")[0] || "Usuario";

      const session: StoredSession = {
        userId: String(id),
        id: String(id),
        displayName,
        apellidos: perfil.apellidos ?? perfil.apellidosUsuario ?? "",
        email: perfil.correo ?? perfil.correoUsuario ?? "",
        region: perfil.region ?? "",
        comuna: perfil.comuna ?? "",
        telefono: perfil.telefono ?? "",
        direccion: perfil.direccion ?? perfil.direccionUsuario ?? "",
        duocMember: isDuocEmail(perfil.correo ?? perfil.correoUsuario ?? ""),
      };

      // Guardar sesión centralizada para mantener consistencia con el resto de la app
      saveSession({
        displayName: displayName,
        loginAt: Date.now(),
        userId: session.userId,
        id: session.id,
        role: perfil.tipoUsuario ?? "cliente",
        duocMember: Boolean(session.duocMember),
        email: session.email,
        apellidos: session.apellidos,
        region: session.region,
        comuna: session.comuna,
        telefono: session.telefono,
        direccion: session.direccion,
        fechaNacimiento: perfil.fechaNacimiento ?? "",
        codigoReferido: perfil.codigoReferido ?? "",
      });

      // Sincronizar usuarios legacy
      try {
        const usersRaw = localStorage.getItem("lvup_users");
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const record = {
          id: session.id,
          nombre: perfil.nombre ?? displayName,
          apellidos: session.apellidos ?? "",
          email: session.email ?? "",
          telefono: session.telefono ?? "",
          direccion: session.direccion ?? "",
          region: session.region ?? "",
          comuna: session.comuna ?? "",
          password: "",
          fechaNacimiento: perfil.fechaNacimiento ?? "",
          genero: perfil.genero ?? "",
          referralCode: perfil.codigoReferido ?? "",
        };
        const existingIndex = users.findIndex((u: any) => String(u.id) === record.id);
        if (existingIndex >= 0) {
          users[existingIndex] = { ...users[existingIndex], ...record };
        } else {
          users.push(record);
        }
        localStorage.setItem("lvup_users", JSON.stringify(users));
      } catch (cacheError) {
        console.warn("No se pudo sincronizar lvup_users desde el backend", cacheError);
      }

      return session;
    } catch (error) {
      console.warn("No se pudo reconstruir la sesión desde el backend", error);
      return null;
    }
  }

  // funcion para continuar al resumen con los datos de envio
  function handleContinuarFormulario(
    datos: DatosEnvio,
    guardarDatos: boolean = true
  ): void {
    console.log("Continuando al resumen con datos:", datos); // Debug
    console.log("Guardar datos:", guardarDatos); // Debug
    setDatosEnvio(datos);
    // guardar datos de envio solo si el usuario quiere
    if (guardarDatos) {
      guardarDatosEnvio(datos); // Guardar datos de envío solo si el usuario quiere
    }

    setStep("resumen"); //y pasa a la siguiente fase
  }

  // funcion para volver al formulario
  function handleVolverFormulario(): void {
    setStep("formulario");
  }

  // funcion para continuar al pago
  function handleContinuarPago(): void {
    setStep("pago");
  }

  // funcion para procesar el pago
  async function handlePagar(datosTarjetaNuevos: DatosTarjeta): Promise<void> {
    if (!datosEnvio) return;

    console.log("Procesando pago con datos de tarjeta:", datosTarjetaNuevos); // Debug

    // Guardar datos de tarjeta ilegal si esq solo se guarda de referencia los datos con ** de referencia de id
    setDatosTarjeta(datosTarjetaNuevos);
    guardarDatosTarjeta(datosTarjetaNuevos);

    setStep("procesando");

    // Crear orden
    const aplicaDescuento = usuarioLogueado
      ? isDuocEmail(usuarioLogueado.email)
      : false;
    const nuevaOrden = crearOrdenCompra(datosEnvio, productos, aplicaDescuento);
    setOrden(nuevaOrden);
    
    try {
      await guardarOrden(nuevaOrden);
    } catch (error) {
      console.error("Error al guardar orden:", error);
    }

    // Procesar pago
    procesarPago(nuevaOrden)
      .then(async (resultado) => {
        // cuando se llama a la funcion procesarPago se ejecuta el then y se pasa el resultado a la funcion
        if (resultado.exito) {
          // si el resultado es true se actualiza el estado de la orden a completada
          await actualizarEstadoOrden(nuevaOrden.codigo, "completada");
          setStep("exitoso");
          vaciarCarrito();
        } else {
          await actualizarEstadoOrden(nuevaOrden.codigo, "fallida");
          setError(resultado.error || "Error desconocido");
          setStep("fallido");
        }
      })
      .catch(async (error) => {
        console.error("Error al procesar pago:", error);
        await actualizarEstadoOrden(nuevaOrden.codigo, "fallida");
        setError("Error al procesar el pago");
        setStep("fallido");
      });
  }

  // funcion para imprimir el pdf de la boleta
  function handleImprimirPDF(): void {
    if (orden) {
      generarPDFBoleta(orden);
    }
  }

  // funcion para enviar el email de la boleta del import{OrdenCompra}
  function handleEnviarEmail(): void {
    if (orden) {
      enviarBoletaPorEmail(orden);
    }
  }
  //esta se activa cuando se completa la compra exitosa y se vuelve al inicio
  function handleVolverInicio(): void {
    navigate("/");
  }
  // funcion para reintentar la compra si falla el pago
  function handleReintentarCompra(): void {
    setStep("pago");
    setError("");
  }

  // funcion para volver al resumen
  function handleVolverPago(): void {
    setStep("resumen");
  }

  // funcion para confirmar la compra rapida
  async function handleConfirmarCompraRapida(): Promise<void> {
    if (!datosEnvio || !datosTarjeta) return; // si no hay datos de envio o de tarjeta se retorna

    console.log("Confirmando compra rápida con datos guardados"); // Debug
    setStep("procesando"); // se pasa a la siguiente fase

    // Crear orden
    const aplicaDescuento = usuarioLogueado
      ? isDuocEmail(usuarioLogueado.email)
      : false;
    const nuevaOrden = crearOrdenCompra(datosEnvio, productos, aplicaDescuento);
    setOrden(nuevaOrden);
    
    try {
      await guardarOrden(nuevaOrden);
    } catch (error) {
      console.error("Error al guardar orden:", error);
    }

    // Procesar pago
    procesarPago(nuevaOrden)
      .then(async (resultado) => {
        if (resultado.exito) {
          await actualizarEstadoOrden(nuevaOrden.codigo, "completada");
          setStep("exitoso");
          vaciarCarrito();
          limpiarDatosCheckout(); // Limpiar datos guardados después de compra exitosa
        } else {
          await actualizarEstadoOrden(nuevaOrden.codigo, "fallida");
          setError(resultado.error || "Error desconocido");
          setStep("fallido");
        }
      })
      .catch(async (error) => {
        console.error("Error al procesar pago:", error);
        await actualizarEstadoOrden(nuevaOrden.codigo, "fallida");
        setError("Error al procesar el pago");
        setStep("fallido");
      });
  }

  // funcion para volver al formulario
  function handleEditarDatos(): void {
    setStep("formulario");
  }

  // funcion para volver al pago
  function handleEditarTarjeta(): void {
    setStep("pago");
  }

  function handleVolverCarrito(): void {
    navigate("/carrito");
  }

  function handleContactarSoporte(): void {
    navigate("/contacto");
  }

  function handleCancelar(): void {
    navigate("/carrito");
  }

  // Calcular valores
  const aplicaDescuento = usuarioLogueado
    ? isDuocEmail(usuarioLogueado.email)
    : false;
  const valores = calcularValoresOrden(productos, aplicaDescuento);

  // retornamos el componente Checkout hacia el App.tsx
  return (
    <div className="wrapper">
      <section className="main-checkout">
        <h2 className="titulo-principal">Checkout</h2>

        <div className="checkout-container">
          {step === "formulario" && (
            <CheckoutFormulario
              onContinuar={handleContinuarFormulario}
              onCancelar={handleCancelar}
              usuarioLogueado={usuarioLogueado}
            />
          )}

          {step === "resumen" && datosEnvio && (
            <CheckoutResumen
              productos={productos}
              datosEnvio={datosEnvio}
              subtotal={valores.subtotal}
              descuento={valores.descuento}
              iva={valores.iva}
              total={valores.total}
              codigoOrden={orden?.codigo || "PENDIENTE"}
              onConfirmarCompra={handleContinuarPago}
              onVolver={handleVolverFormulario}
            />
          )}

          {step === "pago" && (
            <CheckoutPago
              total={valores.total}
              datosTarjetaIniciales={datosTarjeta}
              onPagar={handlePagar}
              onVolver={handleVolverPago}
            />
          )}

          {step === "rapido" && datosEnvio && datosTarjeta && (
            <CheckoutRapido
              productos={productos}
              datosEnvio={datosEnvio}
              datosTarjeta={datosTarjeta}
              subtotal={valores.subtotal}
              descuento={valores.descuento}
              iva={valores.iva}
              total={valores.total}
              onConfirmarCompra={handleConfirmarCompraRapida}
              onEditarDatos={handleEditarDatos}
              onEditarTarjeta={handleEditarTarjeta}
            />
          )}

          {step === "procesando" && (
            <div className="checkout-procesando">
              <div className="procesando-spinner">
                <div className="spinner"></div>
              </div>
              <h3>Procesando tu compra...</h3>
              <p>
                Por favor, no cierres esta ventana mientras procesamos tu pago.
              </p>
            </div>
          )}

          {step === "exitoso" && orden && (
            <CompraExitosa
              productos={productos}
              datosEnvio={datosEnvio!}
              subtotal={valores.subtotal}
              descuento={valores.descuento}
              iva={valores.iva}
              total={valores.total}
              codigoOrden={orden.codigo}
              onImprimirPDF={handleImprimirPDF}
              onEnviarEmail={handleEnviarEmail}
              onVolverInicio={handleVolverInicio}
            />
          )}

          {step === "fallido" && (
            <CompraFallida
              error={error}
              codigoOrden={orden?.codigo}
              onReintentar={handleReintentarCompra}
              onVolverCarrito={handleVolverCarrito}
              onContactarSoporte={handleContactarSoporte}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default Checkout; //exportamos el componente Checkout
