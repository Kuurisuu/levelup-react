import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Producto from "./pages/Producto";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import GamingHub from "./pages/GamingHub";
import Eventos from "./pages/Eventos";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductos from "./pages/AdminProductos";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminOrdenes from "./pages/AdminOrdenes";
import AdminCategorias from "./pages/AdminCategorias";
import AdminReportes from "./pages/AdminReportes";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <Router>
      <Header />
      <main className="wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto" element={<Producto />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />{" "}
          {/* simplemente se agrego esta nueva ruta */}
          <Route path="/gaming-hub" element={<GamingHub />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/ordenes" element={<AdminOrdenes />} />
          <Route path="/admin/categorias" element={<AdminCategorias />} />
          <Route path="/admin/reportes" element={<AdminReportes />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
