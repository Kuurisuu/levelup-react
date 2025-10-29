import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import ModalConfirmacion from '../ModalConfirmacion';

/**
 * Tests para el componente ModalConfirmacion
 * Verifica el renderizado, props, interacciones y visibilidad del modal
 */
describe("ModalConfirmacionComponent", () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = { //seteamos las props basicas para los tests
    isOpen: true,
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
    mensaje: '¿Estás seguro de que quieres eliminar este elemento?' 
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Debería renderizar correctamente cuando isOpen es true", () => {
    render(<ModalConfirmacion {...defaultProps} />);
    
    expect(screen.getByText('¿Estás seguro de que quieres eliminar este elemento?')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();//y las demas opciones de los botones
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  test("Debería NO renderizar cuando isOpen es false", () => {
    render(<ModalConfirmacion {...defaultProps} isOpen={false} />); //renderizamos el modal confirmacion con isOpen false
    //forzamos a que no se renderice el modal confirmacion
    expect(screen.queryByText('¿Estás seguro de que quieres eliminar este elemento?')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument();//no deberia estar 
  });

  test("Debería llamar onConfirm cuando se hace clic en 'Eliminar'", () => {
    render(<ModalConfirmacion {...defaultProps} />);
    
    const eliminarButton = screen.getByRole('button', { name: 'Eliminar' }); //buscamos el boton de eliminar
    fireEvent.click(eliminarButton); //hacemos click en el boton de eliminar
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1); //deberia haber sido llamado 1 vez
  });

  test("Debería llamar onCancel cuando se hace clic en 'Cancelar'", () => {
    render(<ModalConfirmacion {...defaultProps} />);
    
    const cancelarButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelarButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);//la misma de arriba 
  });

  test("Debería mostrar el mensaje correctamente", () => {
    render(<ModalConfirmacion {...defaultProps} mensaje="Mensaje personalizado" />); //renderizamos el modal confirmacion con el mensaje personalizado
    
    expect(screen.getByText('Mensaje personalizado')).toBeInTheDocument(); //deberia tener el texto 'Mensaje personalizado'
  });

  test("Debería mostrar el ícono de advertencia", () => {
    const { container } = render(<ModalConfirmacion {...defaultProps} />); //renderizamos el modal confirmacion con las props basicas
    
    const icon = container.querySelector('.bi-exclamation-triangle'); //buscamos el icono de advertencia
    expect(icon).toBeInTheDocument(); //deberia tener el icono de advertencia
    expect(icon).toHaveClass('bi', 'bi-exclamation-triangle'); //deberia tener la clase bi y la clase bi-exclamation-triangle para el icono de advertencia
  });

  test("Debería tener la estructura HTML correcta", () => {
    const { container } = render(<ModalConfirmacion {...defaultProps} />);
    
    expect(container.querySelector('.modal-overlay')).toBeInTheDocument();
    expect(container.querySelector('.modal-confirmacion')).toBeInTheDocument();
    expect(container.querySelector('.modal-icon')).toBeInTheDocument();
    expect(container.querySelector('.modal-mensaje')).toBeInTheDocument();
    expect(container.querySelector('.modal-botones')).toBeInTheDocument();
  });

  test("Debería renderizar los botones con las clases correctas", () => {
    render(<ModalConfirmacion {...defaultProps} />);
    
    const cancelarButton = screen.getByRole('button', { name: 'Cancelar' }); //buscamos el boton de cancelar
    const eliminarButton = screen.getByRole('button', { name: 'Eliminar' });
    
    expect(cancelarButton).toHaveClass('btn-cancelar'); //deberia tener la clase btn-cancelar
    expect(eliminarButton).toHaveClass('btn-eliminar');
  });

  test("Debería manejar múltiples clics en los botones", () => {
    render(<ModalConfirmacion {...defaultProps} />);
    
    const eliminarButton = screen.getByRole('button', { name: 'Eliminar' });
    const cancelarButton = screen.getByRole('button', { name: 'Cancelar' });
    
    fireEvent.click(eliminarButton);
    fireEvent.click(eliminarButton);
    fireEvent.click(cancelarButton);
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(2); //si le doy 2 veces deberia tener 2 llamadas
    expect(mockOnCancel).toHaveBeenCalledTimes(1); //y 1 vez el cancelar
  });

  test("Debería renderizar correctamente con diferentes mensajes", () => {
    const mensajes = [
      '¿Eliminar producto?',
      '¿Vaciar carrito?',
      '¿Confirmar compra?',
      '¿Eliminar cuenta?'
    ];

    mensajes.forEach(mensaje => { //forzamos a que se renderice el modal confirmacion con los mensajes diferentes
      const { unmount } = render( //renderizamos el modal confirmacion con el mensaje diferente
        <ModalConfirmacion 
          {...defaultProps} 
          mensaje={mensaje} 
        />
      );
      
      expect(screen.getByText(mensaje)).toBeInTheDocument(); //deberia tener el texto del mensaje diferente
      unmount();
    });
  });

  test("Debería hacer match con el snapshot cuando está abierto", () => {
    const { container } = render(<ModalConfirmacion {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  test("Debería hacer match con el snapshot cuando está cerrado", () => { 
    const { container } = render(<ModalConfirmacion {...defaultProps} isOpen={false} />); //renderizamos el modal confirmacion con isOpen false
    expect(container).toMatchSnapshot();
  });

  test("Debería hacer match con el snapshot con mensaje personalizado", () => {
    const { container } = render( 
      <ModalConfirmacion 
        {...defaultProps} 
        mensaje="¿Estás seguro de realizar esta acción irreversible?" 
      />
    ); //renderizamos el modal confirmacion con el mensaje personalizado
    expect(container).toMatchSnapshot();//y con la nueva snap deberia tener los valores diferentes
  });
});
