# Guía de Testing - Level Up React

Esta guía explica la estructura y uso de las pruebas unitarias e integración con Vitest en el proyecto Level Up.

## Estructura de Testing

```
levelup-react/
├── src/
│   ├── components/
│   │   ├── ItemCounter.tsx
│   │   ├── ItemCounter.test.tsx
│   │   ├── ProductoCard.tsx
│   │   └── ProductoCard.test.tsx
│   ├── helpers/
│   │   ├── math.helper.ts
│   │   └── math.helper.test.ts
│   ├── logic/
│   │   ├── carrito.ts
│   │   ├── carrito.test.ts
│   │   ├── storage.ts
│   │   └── storage.test.ts
│   └── tests/
│       └── setup.ts
├── vitest.config.js
└── package.json
```

## Instalación

Para instalar todas las dependencias necesarias:

```bash
npm install
```

Esto instalará:

- `vitest` - Framework de testing
- `@testing-library/react` - Utilidades para testing de React
- `@testing-library/dom` - Testing del DOM
- `@testing-library/user-event` - Simulación de eventos de usuario
- `jsdom` - Entorno de DOM simulado
- `@vitest/ui` - Interfaz gráfica para los tests
- `@vitest/coverage-v8` - Reportes de cobertura

## Comandos Disponibles

### Ejecutar tests en modo watch

```bash
npm test
```

### Ejecutar tests una sola vez

```bash
npm run test:run
```

### Ejecutar tests con interfaz gráfica

```bash
npm run test:ui
```

### Generar reporte de cobertura

```bash
npm run test:coverage
```

## Patrón AAA (Arrange, Act, Assert)

Todos los tests siguen el patrón AAA:

```typescript
test("Debe sumar dos números positivos", () => {
  //! 1 - Arrange (Preparación)
  const a: number = 6;
  const b: number = 10;

  //! 2 - Act (Acción)
  const result: number = add(a, b);

  //! 3 - Assert (Verificación)
  expect(result).toBe(16);
});
```

### 1. Arrange (Preparación)

Configura los datos y el estado necesario para la prueba.

### 2. Act (Acción)

Ejecuta la función o acción que se está probando.

### 3. Assert (Verificación)

Verifica que el resultado es el esperado.

## Tipos de Tests

### Tests Unitarios de Funciones

Ubicación: `src/helpers/`, `src/logic/`

```typescript
import { describe, expect, test } from "vitest";
import { add } from "./math.helper";

describe("Calculadora - Suma", () => {
  test("Debe sumar dos números positivos", () => {
    const a = 6;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(16);
  });
});
```

### Tests de Componentes React

Ubicación: `src/components/`

```typescript
import { describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ItemCounter } from "./ItemCounter";

describe("ItemCounter", () => {
  test("Should render with default values", () => {
    const name = "Test Item";
    render(<ItemCounter name={name} />);
    expect(screen.getByText(name)).toBeDefined();
  });
});
```

### Tests con Snapshots

Los snapshots capturan la estructura HTML del componente:

```typescript
test("Should match snapshot", () => {
  const { container } = render(<ItemCounter name="Test" quantity={5} />);
  expect(container).toMatchSnapshot();
});
```

## Ejemplos de Testing

### 1. Testing de Funciones Helper

**Archivo:** `src/helpers/math.helper.test.ts`

Pruebas de funciones matemáticas básicas:

- Suma de números positivos y negativos
- Resta con diferentes escenarios
- Multiplicación y división
- Cálculo de porcentajes y descuentos

### 2. Testing de Storage

**Archivo:** `src/logic/storage.test.ts`

Pruebas del manejo de localStorage:

- Obtener carrito vacío
- Guardar productos
- Sobrescribir datos existentes
- Mantener estructura correcta

### 3. Testing de Lógica de Carrito

**Archivo:** `src/logic/carrito.test.ts`

Pruebas de la lógica del carrito:

- Agregar productos nuevos
- Incrementar cantidad de productos existentes
- Eliminar productos
- Vaciar carrito completo
- Calcular totales

### 4. Testing de Componentes

**Archivos:**

- `src/components/ItemCounter.test.tsx`
- `src/components/ProductoCard.test.tsx`

Pruebas de componentes React:

- Renderizado inicial
- Interacciones de usuario (clicks, eventos)
- Cambios de estado
- Estilos condicionales
- Props y comportamientos

## Mocking

### Mock de localStorage

El archivo `src/tests/setup.ts` configura un mock de localStorage:

```typescript
beforeEach(() => {
  localStorage.clear();
});
```

### Mock de Funciones

```typescript
import { vi } from "vitest";

vi.mock("../logic/carrito", () => ({
  agregarAlCarrito: vi.fn(),
}));
```

## Assertions Comunes

```typescript
// Igualdad exacta
expect(result).toBe(5);

// Igualdad de objetos
expect(array).toEqual([1, 2, 3]);

// Existencia
expect(element).toBeDefined();
expect(element).not.toBeNull();

// Contenido de texto
expect(text).toContain("palabra");

// Booleanos
expect(condition).toBeTruthy();
expect(condition).toBeFalsy();

// Arrays
expect(array).toHaveLength(3);

// Estados de botones
expect(button).toBeDisabled();
expect(button).not.toBeDisabled();

// Excepciones
expect(() => divide(10, 0)).toThrow("mensaje");
```

## Queries de Testing Library

```typescript
// Por texto
screen.getByText("Texto exacto");
screen.getByText(/expresión regular/i);

// Por rol
screen.getByRole("button");
screen.getAllByRole("button");

// Por label
screen.getByLabelText("Etiqueta");

// Por alt text
screen.getByAltText("Descripción");

// Por data-testid
screen.getByTestId("custom-id");
```

## Eventos de Usuario

```typescript
import { fireEvent } from "@testing-library/react";

// Click
fireEvent.click(button);

// Cambio de input
fireEvent.change(input, { target: { value: "nuevo valor" } });

// Submit de formulario
fireEvent.submit(form);
```

## Cobertura de Código

El reporte de cobertura se genera en `coverage/` e incluye:

- Líneas cubiertas
- Funciones cubiertas
- Ramas cubiertas
- Statements cubiertos

Meta recomendada: **80%** de cobertura mínima

## Buenas Prácticas

1. **Nombres descriptivos**: Los nombres de los tests deben describir claramente qué se está probando
2. **Un concepto por test**: Cada test debe verificar una sola cosa
3. **Tests independientes**: Los tests no deben depender del orden de ejecución
4. **Arrange-Act-Assert**: Seguir siempre el patrón AAA
5. **Limpiar después**: Usar `beforeEach` y `afterEach` para limpiar el estado
6. **Evitar lógica compleja**: Los tests deben ser simples y directos
7. **Tests como documentación**: Los tests deben servir como documentación del código

## Estructura de un Test Completo

```typescript
import { describe, expect, test, beforeEach } from "vitest";

describe("Nombre del módulo o componente", () => {
  beforeEach(() => {
    // Preparación antes de cada test
  });

  test("Descripción de lo que debe hacer", () => {
    //! 1 - Arrange
    // Configurar datos y estado
    //! 2 - Act
    // Ejecutar la acción
    //! 3 - Assert
    // Verificar el resultado
  });
});
```

## Recursos Adicionales

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## Siguientes Pasos

Para agregar tests a un nuevo módulo:

1. Crear archivo `[nombre].test.ts` o `[nombre].test.tsx`
2. Importar las funciones/componentes a probar
3. Escribir tests siguiendo el patrón AAA
4. Ejecutar `npm test` para verificar
5. Revisar cobertura con `npm run test:coverage`

## Ejemplo de Workflow

```bash
# 1. Desarrollar funcionalidad
# 2. Escribir tests
# 3. Ejecutar tests en modo watch
npm test

# 4. Verificar que todos pasen
npm run test:run

# 5. Revisar cobertura
npm run test:coverage

# 6. Si es necesario, agregar más tests para aumentar cobertura
```
