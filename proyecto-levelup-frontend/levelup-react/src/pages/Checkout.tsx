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

// ESTE CHECKOUT ES PARA LA PASARELA DE PAGO Y EL RESUMEN DE LA COMPRA

// Interfaces para el usuario logueado
interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  region: string;
  comuna: string;
  password: string;
  fechaNacimiento: string;
  genero: string;
  referralCode: string;
}

interface UserSession {
  userId: string;
  loginTime: number; //servira para validar si el usuario esta logueado
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
    //useEffect es un hook que se ejecuta cuando el componente se monta
    cargarDatosIniciales();
  }, []); // [] es el array de dependencias y se ejecuta cuando el componente se monta osea a palabras simples si no hay dependencias se ejecuta solo una vez

  function cargarDatosIniciales(): void {
    // Cargar productos del carrito
    const productosCarrito = getCarrito();
    if (productosCarrito.length === 0) {
      // Si no hay productos, redirigir al carrito
      navigate("/carrito");
      return;
    }
    setProductos(productosCarrito);

    // Cargar usuario logueado si existe
    const usuario = getCurrentUser();
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

  // funcion para obtener el usuario logueado
  function getCurrentUser(): User | null {
    try {
      const session = localStorage.getItem("lvup_user_session");
      if (!session) return null;

      const sessionData: UserSession = JSON.parse(session);
      const users = JSON.parse(localStorage.getItem("lvup_users") || "[]");
      return users.find((u: User) => u.id === sessionData.userId) || null;
    } catch {
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
  function handlePagar(datosTarjetaNuevos: DatosTarjeta): void {
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
    guardarOrden(nuevaOrden);

    // Procesar pago
    procesarPago(nuevaOrden)
      .then((resultado) => {
        // cuando se llama a la funcion procesarPago se ejecuta el then y se pasa el resultado a la funcion
        if (resultado.exito) {
          // si el resultado es true se actualiza el estado de la orden a completada
          actualizarEstadoOrden(nuevaOrden.codigo, "completada");
          setStep("exitoso");
          vaciarCarrito();
        } else {
          actualizarEstadoOrden(nuevaOrden.codigo, "fallida");
          setError(resultado.error || "Error desconocido");
          setStep("fallido");
        }
      })
      .catch((error) => {
        console.error("Error al procesar pago:", error);
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
  function handleConfirmarCompraRapida(): void {
    if (!datosEnvio || !datosTarjeta) return; // si no hay datos de envio o de tarjeta se retorna

    console.log("Confirmando compra rápida con datos guardados"); // Debug
    setStep("procesando"); // se pasa a la siguiente fase

    // Crear orden
    const aplicaDescuento = usuarioLogueado
      ? isDuocEmail(usuarioLogueado.email)
      : false;
    const nuevaOrden = crearOrdenCompra(datosEnvio, productos, aplicaDescuento);
    setOrden(nuevaOrden);
    guardarOrden(nuevaOrden);

    // Procesar pago
    procesarPago(nuevaOrden)
      .then((resultado) => {
        if (resultado.exito) {
          actualizarEstadoOrden(nuevaOrden.codigo, "completada");
          setStep("exitoso");
          vaciarCarrito();
          limpiarDatosCheckout(); // Limpiar datos guardados después de compra exitosa
        } else {
          actualizarEstadoOrden(nuevaOrden.codigo, "fallida");
          setError(resultado.error || "Error desconocido");
          setStep("fallido");
        }
      })
      .catch((error) => {
        console.error("Error al procesar pago:", error);
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
