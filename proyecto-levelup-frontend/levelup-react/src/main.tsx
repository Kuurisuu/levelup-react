import "./styles/main.css";
import "./styles/detalle-producto.css";
import "./styles/checkout.css";//nueva ruta para el css del checkout
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
