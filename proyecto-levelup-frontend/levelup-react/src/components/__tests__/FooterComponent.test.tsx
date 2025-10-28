//ESTE ARCHIVO ES PARA HACER PRUEBAS DEL FOOTER
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import Footer from "../Footer";

// Mock de import.meta.env para BASE_URL
Object.defineProperty(import.meta, 'env', {
  value: {
    BASE_URL: '/'
  }
});

describe("Footer", () => {
  test("Debería renderizar la información de la empresa", () => {
    render(<Router><Footer /></Router>);
    
    expect(screen.getByText("© 2025 A.C.A Company")).toBeInTheDocument();//hacemos la basica q existan los textos 
    expect(screen.getByText("Level Up — Gamer")).toBeInTheDocument();
  });

  test("Debería renderizar los enlaces de navegación", () => {
    render(<Router><Footer /></Router>);
    
    expect(screen.getByRole('link', { name: /inicio/i })).toBeInTheDocument(); //link es el enlace de la pagina
    expect(screen.getByRole('link', { name: /carrito/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ingresar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /registrarse/i })).toBeInTheDocument();
  });

  test("Debería renderizar los enlaces de soporte", () => {
    render(<Router><Footer /></Router>);
    
    expect(screen.getByText("Preguntas frecuentes")).toBeInTheDocument();
    expect(screen.getByText("Política de devoluciones")).toBeInTheDocument();
    expect(screen.getByText("Términos y condiciones")).toBeInTheDocument();
    expect(screen.getByText("Política de privacidad")).toBeInTheDocument();
  });

  test("Debería renderizar la información de contacto", () => {
    render(<Router><Footer /></Router>);
    
    expect(screen.getByText("Teléfono: +56 9 1234 5678")).toBeInTheDocument();
    expect(screen.getByText("correo@levelup.cl")).toBeInTheDocument();
    expect(screen.getByText("Santiago, Chile")).toBeInTheDocument();
  });

  test("Debería renderizar los iconos de redes sociales", () => {
    render(<Router><Footer /></Router>);
    
    const instagramLink = screen.getByRole('link', { name: /instagram/i }); //seteamos sacar el rol link por el nombre instagram
    const whatsappLink = screen.getByRole('link', { name: /whatsapp/i });
    
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/level_up_gamer__/'); //deberia tener el link de insta 
    expect(whatsappLink).toHaveAttribute('href', 'https://api.whatsapp.com/send?phone=56912345678&text=Hola,%20necesito%20ayuda');
  });

  test("Debería renderizar los elementos de confianza", () => {
    render(<Router><Footer /></Router>);
    
    expect(screen.getByText("Compra segura")).toBeInTheDocument();
    expect(screen.getByText("Envío a todo Chile")).toBeInTheDocument();
  });

  test("Debería renderizar el copyright", () => {
    render(<Router><Footer /></Router>);
    
    expect(screen.getByText("© 2025 Level Up — Todos los derechos reservados.")).toBeInTheDocument();
  });

  test("Debería tener los títulos de sección correctos", () => {
    render(<Router><Footer /></Router>);
    
    expect(screen.getByText("Enlaces")).toBeInTheDocument();
    expect(screen.getByText("Soporte")).toBeInTheDocument();
    expect(screen.getByText("Contacto")).toBeInTheDocument();
  });

  test("Debería hacer match con el snapshot", () => {
    const { container } = render(<Router><Footer /></Router>);
    expect(container).toMatchSnapshot();//la misma de snapshot q las demas 
  });
});
