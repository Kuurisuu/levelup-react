import React, { useEffect, useState } from "react";
import CarritoVacio from "../components/Carrito/CarritoVacio";
import CarritoProductos from "../components/Carrito/CarritoProductos";
import CarritoAcciones from "../components/Carrito/CarritoAcciones";
import CarritoComprado from "../components/Carrito/CarritoComprado";
import CarritoResumen from "../components/Carrito/CarritoResumen";
import CarritoSugerencias from "../components/Carrito/CarritoSugerencias";
import ModalConfirmacion from "../components/Carrito/ModalConfirmacion";
import {
  getCarrito,
  eliminarDelCarrito,
  vaciarCarrito,
  calcularTotal,
  actualizarNumerito,
} from "../logic/carrito";
import { setCarritoLS, ProductoEnCarrito } from "../logic/storage";
import { productosArray, categorias, subcategorias, Producto } from "../data/catalogo";

// Interfaces
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
  loginTime: number;
}

// Funciones auxiliares
function getUserSession(): UserSession | null {
  try {
    const raw = localStorage.getItem("lvup_user_session");
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function readUsers(): User[] {
  try {
    const item = localStorage.getItem("lvup_users");
    return item ? JSON.parse(item) : [];
  } catch (_) {
    return [];
  }
}

function getCurrentUser(): User | null {
  const session = getUserSession();
  if (!session || !session.userId) return null;
  const users = readUsers();
  return users.find((u: User) => u.id === session.userId) || null;
}

function isDuocEmail(email: string): boolean {
  if (!email) return false;
  const e = String(email).toLowerCase();
  return e.endsWith("@duoc.cl") || e.endsWith("@profesor.duoc.cl");
}

function formatCLP(num: number): string {
  return (
    num?.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }) || "$0"
  );
}

const Carrito: React.FC = (): React.JSX.Element => {
  const [productos, setProductos] = useState<ProductoEnCarrito[]>([]);
  const [descripciones, setDescripciones] = useState<string[]>([]);
  const [estado, setEstado] = useState<"vacio" | "lleno" | "comprado">("vacio"); // vacio, lleno, comprado
  const [total, setTotal] = useState<string>("$0");
  const [aplicaDuoc, setAplicaDuoc] = useState<boolean>(false);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [productoAEliminar, setProductoAEliminar] = useState<string | null>(null);
  const [productosSugeridos, setProductosSugeridos] = useState<Producto[]>([]);

  useEffect(() => {
    cargarProductosCarrito();
    cargarProductosSugeridos();
    // eslint-disable-next-line
  }, []);

  function cargarProductosSugeridos(): void {
    // Obtener productos aleatorios que no estén en el carrito
    const productosEnCarrito = getCarrito();
    const idsEnCarrito = productosEnCarrito.map((p: ProductoEnCarrito) => p.id);
    const productosDisponibles = productosArray.filter((p: Producto) => !idsEnCarrito.includes(p.id));
    
    // Seleccionar 6 productos aleatorios
    const sugeridos: Producto[] = [];
    const copiaDisponibles = [...productosDisponibles];
    for (let i = 0; i < Math.min(6, copiaDisponibles.length); i++) {
      const indiceAleatorio = Math.floor(Math.random() * copiaDisponibles.length);
      sugeridos.push(copiaDisponibles[indiceAleatorio]);
      copiaDisponibles.splice(indiceAleatorio, 1);
    }
    setProductosSugeridos(sugeridos);
  }

  function cargarProductosCarrito(): void {
    const productosEnCarrito = getCarrito();
    if (productosEnCarrito.length > 0) {
      setEstado("lleno");
      // leer el catalogo desde el import como fuente principal; si no hay, usar localStorage
      let catalogoBase: Producto[] = [];
      try {
        const item = localStorage.getItem("catalogo-base");
        catalogoBase = item ? JSON.parse(item) : [];
      } catch (_) {
        catalogoBase = [];
      }
      const descripciones = productosEnCarrito.map((producto: ProductoEnCarrito) => {
        const base =
          productosArray.find((p: Producto) => p.id === producto.id) ||
          catalogoBase.find((p: Producto) => p.id === producto.id) ||
          ({} as Producto);
        const catNombre =
          categorias.find((c) => c.id === base.categoriaId)?.nombre || "";
        const subNombre =
          subcategorias.find((s) => s.id === base.subcategoriaId)?.nombre || "";
        return (
          (base.descripcion && String(base.descripcion).trim()) ||
          `${catNombre}${subNombre ? " • " + subNombre : ""}`
        );
      });
      // Formatear precios y subtotales
      const productosFormateados = productosEnCarrito.map((producto: ProductoEnCarrito) => ({
        ...producto,
        precioCLP: formatCLP(producto.precio),
        subtotalCLP: formatCLP(producto.precio * producto.cantidad),
      }));
      setProductos(productosFormateados);
      setDescripciones(descripciones);
      actualizarTotal();
    } else {
      setEstado("vacio");
      setProductos([]);
      setDescripciones([]);
      setTotal("$0");
    }
  }

  function actualizarTotal(): void {
    const base = calcularTotal();
    const user = getCurrentUser();
    const aplica = user && isDuocEmail(user.email);
    const totalFinal = aplica ? Math.round(base * 0.8) : base;
    setTotal(formatCLP(totalFinal));
    setAplicaDuoc(!!aplica);
  }

  function handleEliminar(id: string): void {
    // Abrir modal de confirmación
    setProductoAEliminar(id);
    setModalAbierto(true);
  }

  function confirmarEliminacion(): void {
    if (productoAEliminar) {
      eliminarDelCarrito(productoAEliminar);
      cargarProductosCarrito();
      actualizarNumerito();
    }
    setModalAbierto(false);
    setProductoAEliminar(null);
  }

  function cancelarEliminacion(): void {
    setModalAbierto(false);
    setProductoAEliminar(null);
  }

  function handleAumentar(id: string): void {
    const carrito = getCarrito();
    const producto = carrito.find((p: ProductoEnCarrito) => p.id === id);
    if (producto) {
      producto.cantidad = (producto.cantidad || 1) + 1;
      setCarritoLS(carrito);
      cargarProductosCarrito();
      actualizarNumerito();
    }
  }

  function handleDisminuir(id: string): void {
    const carrito = getCarrito();
    const producto = carrito.find((p: ProductoEnCarrito) => p.id === id);
    if (producto) {
      const nueva = Math.max(1, (producto.cantidad || 1) - 1);
      producto.cantidad = nueva;
      setCarritoLS(carrito);
      cargarProductosCarrito();
      actualizarNumerito();
    }
  }

  function handleVaciar(): void {
    vaciarCarrito();
    cargarProductosCarrito();
    actualizarNumerito();
  }

  function handleComprar(): void {
    vaciarCarrito();
    setEstado("comprado");
    setProductos([]);
    setDescripciones([]);
    setTotal("$0");
    actualizarNumerito();
  }

  function handleVolver(): void {
    window.location.href = "/";
  }

  // Calcular cantidad total de productos (sumando todas las cantidades)
  const cantidadTotalProductos = productos.reduce((total, producto) => total + producto.cantidad, 0);

  return (
    <div className="wrapper">
      <main className="main-carrito">
        <h2 className="titulo-principal">Carrito</h2>
        <p className="carrito-count">Tu carrito ({cantidadTotalProductos} productos)</p>
        <div className="contenedor-carrito">
          <div className="carrito-productos-seccion">
            {estado === "vacio" && <CarritoVacio />}
            {estado === "lleno" && (
              <CarritoProductos
                productos={productos}
                descripciones={descripciones}
                onEliminar={handleEliminar}
                onAumentar={handleAumentar}
                onDisminuir={handleDisminuir}
              />
            )}
            {estado === "comprado" && <CarritoComprado />}
          </div>
          {estado === "lleno" && (
            <CarritoResumen
              total={total}
              cantidadProductos={cantidadTotalProductos}
              onPagar={handleComprar}
            />
          )}
        </div>
        
        {estado === "lleno" && productosSugeridos.length > 0 && (
          <CarritoSugerencias productos={productosSugeridos} />
        )}
      </main>
      <ModalConfirmacion
        isOpen={modalAbierto}
        onConfirm={confirmarEliminacion}
        onCancel={cancelarEliminacion}
        mensaje="¿Confirmas que quieres eliminar este producto de tu carro de compras?"
      />
    </div>
  );
};

export default Carrito;