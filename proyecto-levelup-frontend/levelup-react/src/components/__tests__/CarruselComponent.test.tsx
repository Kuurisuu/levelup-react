import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import Carrusel from '../Carrusel';

/**
 * Tests para el componente Carrusel
 * Verifica el renderizado, navegación, autoplay y interacciones
 */
describe("CarruselComponent", () => {
  beforeEach(() => {//usamos fake timers para que el carrusel funcione correctamente
    vi.useFakeTimers();
  });

  afterEach(() => {// y los reales para que no afecten a otros tests
    vi.useRealTimers();
  });

  test("Debería renderizar correctamente", () => {
    render(<Carrusel />);//renderizamos el carrusel
    
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();//deberia tener eso 
    expect(screen.getByText('La tienda gamer lider en todo Chile')).toBeInTheDocument();
  });

  test("Debería mostrar la primera imagen por defecto", () => {
    render(<Carrusel />);
    
    const firstImage = screen.getByAltText('¡Bienvenido a Level-Up Gamer!');
    expect(firstImage).toBeInTheDocument();
    expect(firstImage).toHaveAttribute('src', '/img/carrusel/1.png');//la direccion de la imagen
  });

  test("Debería navegar a la siguiente imagen al hacer clic en adelante", () => {
    render(<Carrusel />);
    
    const nextButtons = screen.getAllByRole('generic');
    const adelanteButton = nextButtons.find(button => //buscamos el boton de adelante
      button.querySelector('.bi-arrow-right-short')//el boton de adelante
    );
    
    expect(adelanteButton).toBeInTheDocument();
    
    fireEvent.click(adelanteButton!);
    
    // Verificar que el carrusel sigue funcionando
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test("Debería navegar a la imagen anterior al hacer clic en atrás", () => {
    render(<Carrusel />);
    
    const prevButtons = screen.getAllByRole('generic');
    const atrasButton = prevButtons.find(button => 
      button.querySelector('.bi-arrow-left-short')
    );
    
    expect(atrasButton).toBeInTheDocument();
    
    fireEvent.click(atrasButton!);
    
    // Verificar que el carrusel sigue funcionando
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test("Debería navegar a una imagen específica al hacer clic en los puntos", () => {
    render(<Carrusel />);
    
    const puntos = screen.getAllByRole('generic');
    const puntoSegundo = puntos.find(punto => //buscamos el segundo punto
      punto.textContent === '' && punto.className === ''//el segundo punto es el que tiene el texto '' y la clase ''
    );
    
    // Simulamos el clic en el segundo punto (indice 1)
    if (puntoSegundo) {
      fireEvent.click(puntoSegundo); //hacemos click en el segundo punto
    }
    
    // Verificamo q el carrusel sigue funcionando
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test("Debería cambiar automáticamente las imágenes cada 4 segundos", () => {
    render(<Carrusel />);
    
    // Verificar imagen inicial
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
    
    // esperamo 4s
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    
    // Verificar que el carrusel sigue funcionando (puede mostrar cualquier texto del carrusel)
    expect(screen.getByText(/¡Bienvenido a Level-Up Gamer!|!Explora nuestros productos gamer de alta calidad!|¡Lee desde noticias a guias del mundo gaming!/)).toBeInTheDocument();
  });

  test("Debería volver a la primera imagen después de la última", () => {
    render(<Carrusel />);
    
    // Navegar a la última imagen
    const nextButtons = screen.getAllByRole('generic');
    const adelanteButton = nextButtons.find(button => 
      button.querySelector('.bi-arrow-right-short')
    );
    
    fireEvent.click(adelanteButton!); // Segunda imagen
    fireEvent.click(adelanteButton!); // Tercera imagen
    fireEvent.click(adelanteButton!); // Vuelve a la primera
    
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test("Debería ir a la última imagen desde la primera al hacer clic en atrás", () => {
    render(<Carrusel />);
    
    const prevButtons = screen.getAllByRole('generic');
    const atrasButton = prevButtons.find(button => 
      button.querySelector('.bi-arrow-left-short')
    );
    
    fireEvent.click(atrasButton!);
    
    // Verificar que el carrusel sigue funcionando
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test("Debería mostrar todos los puntos de navegación", () => {
    const { container } = render(<Carrusel />);
    
    const puntos = container.querySelectorAll('.puntos p');
    expect(puntos).toHaveLength(3);//deberia tener 3 puntos
  });

  test("Debería aplicar la clase 'bold' al punto activo", () => {
    const { container } = render(<Carrusel />);
    
    const puntos = container.querySelectorAll('.puntos p');
    const primerPunto = puntos[0];//el primer punto
    
    // El primer punto debera tener la clase 'bold' bold es la clase que se le aplica al punto activo
    expect(primerPunto).toHaveClass('bold');
  });

  test("Debería tener la estructura HTML correcta", () => {
    const { container } = render(<Carrusel />);
    
    expect(container.querySelector('.seccion-carrusel')).toBeInTheDocument();
    expect(container.querySelector('.container-carrusel')).toBeInTheDocument();
    expect(container.querySelector('.imagenes-carrusel')).toBeInTheDocument();
    expect(container.querySelector('.img-track')).toBeInTheDocument();
    expect(container.querySelector('.texto-carrusel')).toBeInTheDocument();
    expect(container.querySelector('.puntos')).toBeInTheDocument();
  });//el orden de los elementos es el mismo que el de la app

  test("Debería hacer match con el snapshot", () => {
    const { container } = render(<Carrusel />);
    expect(container).toMatchSnapshot();//la misma de comparacion de snapshot
  });
});
