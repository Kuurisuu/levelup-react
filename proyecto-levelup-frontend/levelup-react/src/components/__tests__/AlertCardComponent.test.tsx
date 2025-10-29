import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import AlertCard from '../AlertCard';//este alert card es el que usamos en la app para mostrar alertas en la pantalla de login y register

/**
 * Tests para el componente AlertCard
 * Verifica el renderizado, props, interacciones y diferentes tipos de alertas
 */
describe("AlertCardComponent", () => {
  const mockOnAction = vi.fn();

  const defaultProps = {
    type: 'info' as const,
    title: 'Test Alert',
    message: 'This is a test message',
    icon: 'bi bi-info-circle'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Debería renderizar correctamente con props básicas", () => {
    render(<AlertCard {...defaultProps} />);
    
    expect(screen.getByText('Test Alert')).toBeInTheDocument();
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
    
    // Verificar que existe un icono
    const icons = screen.getAllByRole('generic'); //obtenemos todos los iconos
    expect(icons.length).toBeGreaterThan(0); //vemos que exista al menos un icono
  });

  test("Debería aplicar la clase CSS correcta según el tipo", () => {
    const { rerender, container } = render(<AlertCard {...defaultProps} type="warning" />); //renderizamos el alert card con el tipo warning
    expect(container.querySelector('.alert-card')).toHaveClass('alert-card', 'warning'); //vemos que el alert card tenga la clase alert-card y la clase warning

    rerender(<AlertCard {...defaultProps} type="danger" />);
    expect(container.querySelector('.alert-card')).toHaveClass('alert-card', 'danger');

    rerender(<AlertCard {...defaultProps} type="success" />);
    expect(container.querySelector('.alert-card')).toHaveClass('alert-card', 'success');

    rerender(<AlertCard {...defaultProps} type="info" />);
    expect(container.querySelector('.alert-card')).toHaveClass('alert-card', 'info');
  });

  test("Debería mostrar el botón de acción cuando se proporcionan actionText y onAction", () => {
    render(
      <AlertCard 
        {...defaultProps} 
        actionText="Click me" 
        onAction={mockOnAction} 
      />
    );
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-alert');
  });

  test("Debería NO mostrar el botón de acción cuando no se proporcionan actionText o onAction", () => {
    render(<AlertCard {...defaultProps} actionText="Click me" />); //renderizamos el alert card con el actionText "Click me"
    expect(screen.queryByRole('button')).not.toBeInTheDocument(); //vemos que el boton no este en la pantalla

    render(<AlertCard {...defaultProps} onAction={mockOnAction} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test("Debería llamar onAction cuando se hace clic en el botón", () => {
    render(
      <AlertCard 
        {...defaultProps} 
        actionText="Click me" 
        onAction={mockOnAction} 
      />
    );
    
    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);
    
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });

  test("Debería renderizar el ícono correctamente", () => {
    render(<AlertCard {...defaultProps} icon="bi bi-exclamation-triangle" />);
    
    // Verificar que existe un ícono
    const icons = screen.getAllByRole('generic');
    expect(icons.length).toBeGreaterThan(0);
  });

  test("Debería renderizar el título y mensaje correctamente", () => {
    render(
      <AlertCard 
        {...defaultProps} 
        title="Custom Title" 
        message="Custom message content" 
      />
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message content')).toBeInTheDocument();
  });

  test("Debería tener la estructura HTML correcta", () => {
    const { container } = render(<AlertCard {...defaultProps} />);
    
    expect(container.querySelector('.alert-card')).toBeInTheDocument();
    expect(container.querySelector('.alert-icon')).toBeInTheDocument();
    expect(container.querySelector('.alert-content')).toBeInTheDocument();
  });

  test("Debería hacer match con el snapshot", () => {
    const { container } = render(<AlertCard {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  test("Debería hacer match con el snapshot con botón de acción", () => {
    const { container } = render(
      <AlertCard 
        {...defaultProps} 
        actionText="Action Button" 
        onAction={mockOnAction} 
      />
    );
    expect(container).toMatchSnapshot();
  });
});
