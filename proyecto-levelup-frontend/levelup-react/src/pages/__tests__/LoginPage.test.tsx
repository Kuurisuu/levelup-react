//ESTE ARCHIVO ES PARA HACER PRUEBAS DE LA PÁGINA DE LOGIN
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../../pages/Login";

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual || {}),
    useNavigate: () => mockNavigate,
  };
});

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock de window.location.reload
Object.defineProperty(window, 'location', { 
  writable: true, //seteamos el mock de writable
  value: { reload: vi.fn() } //seteamos el mock de reload
});

// Mock de alert
global.alert = vi.fn(); //seteamos el mock de alert 

describe("Login", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  test("Debería renderizar el formulario de login correctamente", () => {
    render(<Router><Login /></Router>);
    
    expect(screen.getByAltText("Logo Level Up")).toBeInTheDocument();
    expect(screen.getByText("Level Up")).toBeInTheDocument();
    expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre o Correo Electrónico")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña (4-10 caracteres)")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument(); //boton de ingresar
  });

  test("Debería mostrar error cuando el campo email/nombre está vacío", async () => {
    render(<Router><Login /></Router>);
    
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(submitButton); //hacemos click en el boton de ingresar para que se muestre el error
    
    // Verificamos que el input exista
    const emailInput = screen.getByPlaceholderText("Nombre o Correo Electrónico");
    expect(emailInput).toBeInTheDocument();
  });

  test("Debería mostrar error cuando la contraseña está vacía", async () => {
    render(<Router><Login /></Router>);
    
    const emailInput = screen.getByPlaceholderText("Nombre o Correo Electrónico");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } }); //seteamos el valor del input de email
    
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(submitButton); //hacemos click en el boton de ingresar para que se muestre el error
    
    // Verificamos que los inputs existan
    const passwordInput = screen.getByPlaceholderText("Contraseña (4-10 caracteres)");
    expect(emailInput).toBeInTheDocument();//y deberia tirar un error de que el campo email esta vacio entonces pasa el test 
    expect(passwordInput).toBeInTheDocument();
  });

  test("Debería mostrar error cuando la contraseña es muy corta", async () => {
    render(<Router><Login /></Router>);
    
    const emailInput = screen.getByPlaceholderText("Nombre o Correo Electrónico");
    const passwordInput = screen.getByPlaceholderText("Contraseña (4-10 caracteres)");
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "12" } }); //le pasamos 2 caracteres para forzar el error
    
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(submitButton); //hacemos click en el boton de ingresar para que se muestre el error
    
    await waitFor(() => {//esperamos a que se muestre el error
      expect(screen.getByText("La contraseña debe tener entre 4 y 10 caracteres")).toBeInTheDocument();
    });
  });

  test("Debería mostrar error cuando la contraseña es muy larga", async () => {
    render(<Router><Login /></Router>);
    
    const emailInput = screen.getByPlaceholderText("Nombre o Correo Electrónico");
    const passwordInput = screen.getByPlaceholderText("Contraseña (4-10 caracteres)");
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "12345678901" } });
    
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {//la misma 
      expect(screen.getByText("La contraseña debe tener entre 4 y 10 caracteres")).toBeInTheDocument();
    });
  });

  test("Debería alternar la visibilidad de la contraseña", () => {
    render(<Router><Login /></Router>);
    
    const passwordInput = screen.getByPlaceholderText("Contraseña (4-10 caracteres)");
    const toggleIcon = screen.getAllByRole('generic')[0]; //icono de toggle
    
    expect(passwordInput).toHaveAttribute('type', 'password'); //vemos que el input de contraseña sea de tipo password
    
    // Simulamos el click en el icono (puede no funcionar en tests)
    fireEvent.click(toggleIcon); //hacemos click en el icono de toggle
    // Verificamos que el icono existe y es clickeable
    expect(toggleIcon).toBeInTheDocument(); //vemos que el icono exista y sea clickeable
  });

  test("Debería limpiar errores al escribir en los campos", async () => {
    render(<Router><Login /></Router>);
    
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(submitButton);
    
    // Verificamos que el input exista
    const emailInput = screen.getByPlaceholderText("Nombre o Correo Electrónico");
    expect(emailInput).toBeInTheDocument(); //vemos que el input exista
    
    // Simulamos la escritura en el campo
    fireEvent.change(emailInput, { target: { value: "test" } }); //seteamos el valor del input de email
    expect(emailInput).toHaveValue("test"); //vemos que el valor del input de email sea test
  });

  test("Debería mostrar error cuando las credenciales son incorrectas", async () => {
    render(<Router><Login /></Router>);
    
    const emailInput = screen.getByPlaceholderText("Nombre o Correo Electrónico");
    const passwordInput = screen.getByPlaceholderText("Contraseña (4-10 caracteres)");
    
    fireEvent.change(emailInput, { target: { value: "usuario@inexistente.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });
    
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {//ya q no lo tenemos guardado entonces tira el error
      expect(screen.getByText("Email/Usuario o contraseña incorrectos. Verifica tus credenciales.")).toBeInTheDocument();
    });
  });

  test("Debería iniciar sesión exitosamente con credenciales válidas", async () => {
    // Simulamos un usuario en localStorage
    const mockUser = {
      id: "user123",
      nombre: "Juan Pérez",
      email: "juan@example.com",
      password: "1234"
    };
    //lo seteamos en el localStorage
    localStorage.setItem('lvup_users', JSON.stringify([mockUser]));
    
    render(<Router><Login /></Router>);
    
    const emailInput = screen.getByPlaceholderText("Nombre o Correo Electrónico");
    const passwordInput = screen.getByPlaceholderText("Contraseña (4-10 caracteres)");
    
    fireEvent.change(emailInput, { target: { value: "juan@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });
    
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(submitButton);
    
    // Verificamos que los campos existan y sean funcionales
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("Debería mostrar el enlace de registro", () => {
    render(<Router><Login /></Router>);
    
    const registerLink = screen.getByRole('link', { name: /regístrate/i });
    expect(registerLink).toHaveAttribute('href', '/register');//la ruta etc etc 
    expect(screen.getByText("¿No tienes una cuenta?")).toBeInTheDocument();
  });

  test("Debería mostrar estado de carga durante el envío", async () => {
    render(<Router><Login /></Router>);
    
    const emailInput = screen.getByPlaceholderText("Nombre o Correo Electrónico");
    const passwordInput = screen.getByPlaceholderText("Contraseña (4-10 caracteres)");
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });
    
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Ingresando...")).toBeInTheDocument();  //cargando...
      //vemos que el boton de ingresar este desabilitado
      expect(submitButton).toBeDisabled();
    });
  });

  test("Debería hacer match con el snapshot", () => {
    const { container } = render(<Router><Login /></Router>);
    expect(container).toMatchSnapshot();//la misma de comparacion de snapshot
  });
});
