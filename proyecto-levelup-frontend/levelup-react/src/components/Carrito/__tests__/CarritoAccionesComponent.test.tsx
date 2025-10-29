import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import CarritoAcciones from '../CarritoAcciones';

/**
 * Tests para el componente CarritoAcciones
 * Verifica el renderizado, props, interacciones y funcionalidades del carrito
 */
describe("CarritoAccionesComponent", () => {
  const mockOnVaciar = vi.fn();
  const mockOnCheckout = vi.fn();
  const mockOnVolver = vi.fn();//traemos las funciones mock para las acciones

  //seteamos las props basicas
  const defaultProps = {
    onVaciar: mockOnVaciar,
    onCheckout: mockOnCheckout,
    total: '$50,000',
    aplicaDuoc: false,
    onVolver: mockOnVolver
  };

  beforeEach(() => {
    vi.clearAllMocks();//limpiamos las llamadas mock para que no afecten a otros tests
  });

  test("Debería renderizar correctamente con props básicas", () => {
    render(<CarritoAcciones {...defaultProps} />);
    
    expect(screen.getByText('Vaciar carrito')).toBeInTheDocument();
    expect(screen.getByText('Seguir comprando')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('PROCEDER AL PAGO')).toBeInTheDocument();
  });//deberia tener eso xd

  test("Debería llamar onVaciar cuando se hace clic en 'Vaciar carrito'", () => {
    render(<CarritoAcciones {...defaultProps} />);//renderizamos el carrito acciones con las props basicas
    
    const vaciarButton = screen.getByRole('button', { name: 'Vaciar carrito' });//buscamos el boton de vaciar carrito
    fireEvent.click(vaciarButton);//hacemos click en el boton de vaciar carrito
    
    expect(mockOnVaciar).toHaveBeenCalledTimes(1);//deberia haber sido llamada 1 vez
  });

  test("Debería llamar onVolver cuando se hace clic en 'Seguir comprando'", () => {
    render(<CarritoAcciones {...defaultProps} />);
    
    const volverButton = screen.getByRole('button', { name: 'Seguir comprando' });//buscamos el boton de seguir comprando
    fireEvent.click(volverButton);//hacemos click en el boton de seguir comprando
    
    expect(mockOnVolver).toHaveBeenCalledTimes(1);//deberia haber sido llamada 1 vez
  });

  test("Debería llamar onCheckout cuando se hace clic en 'PROCEDER AL PAGO'", () => {
    render(<CarritoAcciones {...defaultProps} />);
    
    const checkoutButton = screen.getByRole('button', { name: 'PROCEDER AL PAGO' });
    fireEvent.click(checkoutButton);
    
    expect(mockOnCheckout).toHaveBeenCalledTimes(1);//LA MISMA DE ARRIBA 
  });

  test("Debería mostrar el total correctamente", () => {
    render(<CarritoAcciones {...defaultProps} total="$75,000" />);//renderizamos el carrito acciones con el total $75,000
    
    expect(screen.getByText('$75,000')).toBeInTheDocument();//deberia tener el total $75,000 nada mas interesante 
  });

  test("Debería mostrar el tooltip de descuento DUOC cuando aplicaDuoc es true", () => {
    render(<CarritoAcciones {...defaultProps} aplicaDuoc={true} />);
    
    const totalElement = screen.getByText('$50,000');
    expect(totalElement).toHaveAttribute('title', 'Descuento DUOC -20% aplicado'); //el tooltip de descuento DUOC es -20% aplicado
  });

  test("Debería NO mostrar el tooltip cuando aplicaDuoc es false", () => {
    render(<CarritoAcciones {...defaultProps} aplicaDuoc={false} />);//renderizamos el carrito acciones con aplicaDuoc false
    
    const totalElement = screen.getByText('$50,000');//buscamos el total $50,000
    expect(totalElement).not.toHaveAttribute('title');//no deberia tener el tooltip de descuento DUOC
  });

  test("Debería tener los IDs correctos en los elementos", () => {
    render(<CarritoAcciones {...defaultProps} />);
    
    expect(screen.getByText('Vaciar carrito')).toBeInTheDocument();
    expect(screen.getByText('Seguir comprando')).toBeInTheDocument();
    expect(screen.getByText('PROCEDER AL PAGO')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  test("Debería tener las clases CSS correctas", () => {
    const { container } = render(<CarritoAcciones {...defaultProps} />);
    
    expect(container.querySelector('.carrito-acciones')).toBeInTheDocument();//deberia tener la clase carrito-acciones etc
    expect(container.querySelector('.carrito-acciones-izquierda')).toBeInTheDocument();
    expect(container.querySelector('.carrito-acciones-derecha')).toBeInTheDocument();
    expect(container.querySelector('.carrito-acciones-total')).toBeInTheDocument();
  });

  test("Debería renderizar todos los botones con las clases correctas", () => {
    render(<CarritoAcciones {...defaultProps} />);//renderizamos el carrito acciones con las props basicas
    
    const vaciarButton = screen.getByRole('button', { name: 'Vaciar carrito' }); //buscamos el boton de vaciar carrito
    const volverButton = screen.getByRole('button', { name: 'Seguir comprando' });
    const checkoutButton = screen.getByRole('button', { name: 'PROCEDER AL PAGO' });
    
    expect(vaciarButton).toHaveClass('boton-menu', 'carrito-acciones-vaciar');//deberia tener la clase boton-menu y la clase carrito-acciones-vaciar
    expect(volverButton).toHaveClass('boton-menu', 'boton-volver-carrito');
    expect(checkoutButton).toHaveClass('carrito-acciones-comprar');
  });

  test("Debería hacer match con el snapshot", () => {
    const { container } = render(<CarritoAcciones {...defaultProps} />);
    expect(container).toMatchSnapshot();//la misma de comparacion de snapshot
  });

  test("Debería hacer match con el snapshot con descuento DUOC", () => {
    const { container } = render(<CarritoAcciones {...defaultProps} aplicaDuoc={true} />);
    expect(container).toMatchSnapshot();//esta es diferente ya que aplicaDuoc es true
  });
});
