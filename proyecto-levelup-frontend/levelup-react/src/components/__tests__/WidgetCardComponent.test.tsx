import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import WidgetCard from '../WidgetCard';//este widget card es el que usamos en la app para mostrar widgets en la pantalla de home cmo noticias blogs etc 
/**
 * Tests para el componente WidgetCard
 * Verifica el renderizado, props y contenido children
 */
describe("WidgetCardComponent", () => {
  const defaultProps = {
    title: 'Test Widget',//titulo del widget
    children: <div data-testid="widget-content">Widget Content</div>//contenido del widget
  };

  test("Debería renderizar correctamente con props básicas", () => {
    render(<WidgetCard {...defaultProps} />);//renderizamos el widget card con las props basicas
    
    expect(screen.getByText('Test Widget')).toBeInTheDocument();//deberia tener el titulo del widget
    expect(screen.getByTestId('widget-content')).toBeInTheDocument();
  });

  test("Debería renderizar el título correctamente", () => {
    render(<WidgetCard {...defaultProps} title="Custom Widget Title" />);
    
    expect(screen.getByText('Custom Widget Title')).toBeInTheDocument();
  });

  test("Debería renderizar el contenido children correctamente", () => {
    const customContent = <div data-testid="custom-widget">Custom Widget Data</div>;
    render(<WidgetCard {...defaultProps} children={customContent} />);
    
    expect(screen.getByTestId('custom-widget')).toBeInTheDocument();
    expect(screen.getByText('Custom Widget Data')).toBeInTheDocument();
  });

  test("Debería renderizar múltiples children correctamente", () => {
    const multipleChildren = (
      <>
        <div data-testid="widget-1">Widget 1</div>
        <div data-testid="widget-2">Widget 2</div>
        <div data-testid="widget-3">Widget 3</div>
      </>
    );//3 hijos 
    
    render(<WidgetCard {...defaultProps} children={multipleChildren} />);//renderizamos el widget card con los 3 hijos
    
    expect(screen.getByTestId('widget-1')).toBeInTheDocument();
    expect(screen.getByTestId('widget-2')).toBeInTheDocument();
    expect(screen.getByTestId('widget-3')).toBeInTheDocument();
  });

  test("Debería renderizar contenido complejo correctamente", () => {
    const complexContent = (
      <div>
        <h4>Widget Header</h4>
        <p>Widget description</p>
        <button>Widget Button</button>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    );
    
    render(<WidgetCard {...defaultProps} children={complexContent} />);
    
    expect(screen.getByText('Widget Header')).toBeInTheDocument();
    expect(screen.getByText('Widget description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Widget Button' })).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test("Debería manejar children vacíos", () => {
    render(<WidgetCard {...defaultProps} children={null} />);//renderizamos el widget card con children null
    
    expect(screen.getByText('Test Widget')).toBeInTheDocument();//deberia tener el titulo del widget
  });

  test("Debería manejar children undefined", () => {
    render(<WidgetCard {...defaultProps} children={undefined} />);//renderizamos el widget card con children undefined
    
    expect(screen.getByText('Test Widget')).toBeInTheDocument();//deberia tener el titulo del widget
  });

  test("Debería tener la estructura HTML correcta", () => {
    const { container } = render(<WidgetCard {...defaultProps} />);
    
    expect(container.querySelector('.widget-card')).toBeInTheDocument();
  });

  test("Debería renderizar el título como h3", () => {
    const { container } = render(<WidgetCard {...defaultProps} />);
    
    const title = container.querySelector('h3');//el titulo del widget es un h3
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Test Widget');
  });

  test("Debería hacer match con el snapshot", () => {
    const { container } = render(<WidgetCard {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  test("Debería hacer match con el snapshot con contenido complejo", () => {
    const complexContent = (
      <div>
        <h4>Complex Widget</h4>
        <p>This is a complex widget with multiple elements</p>
        <button>Action Button</button>
      </div>
    );
    
    const { container } = render(<WidgetCard {...defaultProps} children={complexContent} />);
    expect(container).toMatchSnapshot();//la misma de comparacion de snapshot
  });
});
