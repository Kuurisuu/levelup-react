import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import CarritoResumen from '../CarritoResumen';

/**
 * Tests para el componente CarritoResumen
 * Verifica el renderizado, props, interacciones y funcionalidades del resumen
 */
describe("CarritoResumenComponent", () => {
  const mockOnPagar = vi.fn();

  const defaultProps = {
    total: '$50,000',
    cantidadProductos: 3,
    onPagar: mockOnPagar
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Debería renderizar correctamente con props básicas", () => {
    render(<CarritoResumen {...defaultProps} />);
    
    expect(screen.getByText('Resumen de tu compra')).toBeInTheDocument(); 
    expect(screen.getByText('Productos (3)')).toBeInTheDocument();
    expect(screen.getByText('Total Transferencia / Débito')).toBeInTheDocument(); //el total de la compra es de $50,000
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('Pagar')).toBeInTheDocument();
  });

  test("Debería mostrar la cantidad de productos correctamente", () => {
    render(<CarritoResumen {...defaultProps} cantidadProductos={5} />);
    
    expect(screen.getByText('Productos (5)')).toBeInTheDocument(); //la cantidad de productos es 5
  });

  test("Debería mostrar el total correctamente", () => {
    render(<CarritoResumen {...defaultProps} total="$75,000" />);
    
    expect(screen.getByText('$75,000')).toBeInTheDocument(); //el total de la compra es el mismo q seteamos 
  });

  test("Debería llamar onPagar cuando se hace clic en 'Pagar'", () => {
    render(<CarritoResumen {...defaultProps} />);
    
    const pagarButton = screen.getByRole('button', { name: 'Pagar' });
    fireEvent.click(pagarButton);
    
    expect(mockOnPagar).toHaveBeenCalledTimes(1);
  });

  test("Debería mostrar el mensaje de despacho", () => {
    render(<CarritoResumen {...defaultProps} />);
    
    expect(screen.getByText('El valor del despacho se calculará cuando se seleccione el tipo de entrega.')).toBeInTheDocument();
  });

  test("Debería mostrar los íconos de seguridad", () => {
    render(<CarritoResumen {...defaultProps} />);
    
    const lockIcon = screen.getAllByRole('generic').find(icon => //buscamos el icono de seguridad
      icon.querySelector('.bi-lock-fill')//el icono de seguridad es el lock fill
    );
    const shieldIcon = screen.getAllByRole('generic').find(icon => 
      icon.querySelector('.bi-shield-check')
    );
    
    expect(lockIcon).toBeInTheDocument();//deberia tener el icono de seguridad
    expect(shieldIcon).toBeInTheDocument();
  });

  test("Debería mostrar los textos de seguridad", () => {
    render(<CarritoResumen {...defaultProps} />);
    
    expect(screen.getByText('Pago 100% seguro')).toBeInTheDocument();
    expect(screen.getByText('Garantía en tus productos')).toBeInTheDocument();
  });

  test("Debería tener la estructura HTML correcta", () => {
    const { container } = render(<CarritoResumen {...defaultProps} />); //renderizamos el carrito resumen con las props basicas
    //deberia tener esa estructura 
    expect(container.querySelector('.carrito-resumen')).toBeInTheDocument();
    expect(container.querySelector('.resumen-header')).toBeInTheDocument();
    expect(container.querySelector('.resumen-titulo')).toBeInTheDocument();
    expect(container.querySelector('.resumen-productos')).toBeInTheDocument();
    expect(container.querySelector('.resumen-total')).toBeInTheDocument();
    expect(container.querySelector('.resumen-despacho')).toBeInTheDocument();
    expect(container.querySelector('.resumen-seguridad')).toBeInTheDocument();
  });

  test("Debería manejar cantidad de productos 0", () => {
    render(<CarritoResumen {...defaultProps} cantidadProductos={0} />); //renderizamos el carrito resumen con la cantidad de productos 0
    
    expect(screen.getByText('Productos (0)')).toBeInTheDocument(); //deberia tener el texto 'Productos (0)'
  });

  test("Debería manejar cantidad de productos 1", () => {
    render(<CarritoResumen {...defaultProps} cantidadProductos={1} />);
    
    expect(screen.getByText('Productos (1)')).toBeInTheDocument();//y 1 con este 
  });

  test("Debería renderizar el botón de pagar con la clase correcta", () => {
    render(<CarritoResumen {...defaultProps} />);
    
    const pagarButton = screen.getByRole('button', { name: 'Pagar' });//buscamos el boton de pagar
    expect(pagarButton).toHaveClass('btn-pagar');
  });

  test("Debería hacer match con el snapshot", () => {
    const { container } = render(<CarritoResumen {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  test("Debería hacer match con el snapshot con diferentes props", () => {
    const { container } = render( //renderizamos el carrito resumen con las props diferentes
      <CarritoResumen 
        total="$100,000" 
        cantidadProductos={10} 
        onPagar={mockOnPagar} 
      />
    );
    expect(container).toMatchSnapshot();//y con la nueva snap deberia tener los valores diferentes
  });
});
