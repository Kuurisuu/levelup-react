# Inicio Rápido - Testing con Vitest

## Pasos para Empezar

### 1. Instalar Dependencias

```bash
cd proyecto-levelup-frontend/levelup-react
npm install
```

Esto instalará todas las dependencias necesarias para testing:

- vitest
- @testing-library/react
- @testing-library/dom
- jsdom
- Y más...

### 2. Ejecutar Tests

```bash
npm test
```

Verás algo como esto:

```
✓ src/helpers/math.helper.test.ts (12 tests)
✓ src/utils/format.helper.test.ts (28 tests)
✓ src/logic/storage.test.ts (6 tests)
✓ src/logic/carrito.test.ts (13 tests)
✓ src/components/ItemCounter.test.tsx (10 tests)
✓ src/components/ProductoCard.test.tsx (11 tests)

Test Files  6 passed (6)
     Tests  70 passed (70)
```

### 3. Ver Interfaz Gráfica

```bash
npm run test:ui
```

Se abrirá una interfaz web en `http://localhost:51204` donde podrás:

- Ver todos los tests
- Ejecutar tests individuales
- Ver resultados en tiempo real
- Debug interactivo

### 4. Generar Reporte de Cobertura

```bash
npm run test:coverage
```

Esto genera un reporte en `coverage/index.html`

## Archivos Creados

### Archivos de Configuración

- `vitest.config.js` - Configuración de Vitest
- `src/tests/setup.ts` - Setup inicial (mocks de localStorage)
- `.gitignore` - Actualizado con carpetas de testing

### 🧪 Tests de Ejemplo

#### Funciones Helper

- `src/helpers/math.helper.ts` + `.test.ts` (12 tests)
- `src/utils/format.helper.ts` + `.test.ts` (28 tests)

#### Lógica de Negocio

- `src/logic/storage.test.ts` (6 tests)
- `src/logic/carrito.test.ts` (13 tests)

#### Componentes React

- `src/components/ItemCounter.tsx` + `.test.tsx` (10 tests)
- `src/components/ProductoCard.test.tsx` (11 tests)

### Documentación

- `README_TESTING.md` - Guía completa
- `COMANDOS_TESTING.md` - Referencia de comandos
- `ESTRUCTURA_TESTING.md` - Estructura de archivos
- `INICIO_RAPIDO_TESTING.md` - Este archivo

## Ejemplos de Tests

### Test Unitario Simple

```typescript
import { describe, expect, test } from "vitest";
import { add } from "./math.helper";

describe("Suma", () => {
  test("Debe sumar dos números", () => {
    //! 1 - Arrange
    const a = 5;
    const b = 3;

    //! 2 - Act
    const resultado = add(a, b);

    //! 3 - Assert
    expect(resultado).toBe(8);
  });
});
```

### Test de Componente

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { ItemCounter } from "./ItemCounter";

test("Debe incrementar el contador", () => {
  //! 1 - Arrange
  render(<ItemCounter name="Test" quantity={5} />);

  //! 2 - Act
  const button = screen.getAllByRole("button")[0];
  fireEvent.click(button);

  //! 3 - Assert
  expect(screen.getByText("6")).toBeDefined();
});
```

## Comandos Esenciales

```bash
# Modo watch (recomendado durante desarrollo)
npm test

# Ejecutar una sola vez
npm run test:run

# Interfaz gráfica
npm run test:ui

# Cobertura
npm run test:coverage

# Ejecutar un archivo específico
npx vitest src/helpers/math.helper.test.ts

# Actualizar snapshots
npm test -- -u
```

## Estructura del Patrón AAA

Todos los tests siguen el patrón **Arrange-Act-Assert**:

```typescript
test("Descripción del test", () => {
  //! 1 - Arrange (Preparación)
  // Configura los datos necesarios
  //! 2 - Act (Acción)
  // Ejecuta la función o acción
  //! 3 - Assert (Verificación)
  // Verifica el resultado esperado
});
```

## Próximos Pasos

### 1. Explorar los Tests Existentes

Revisa los archivos `.test.ts` y `.test.tsx` para ver ejemplos completos.

### 2. Crear Tests para tus Componentes

Sigue el patrón de los ejemplos para crear tests de tus propios componentes:

```bash
# Para un nuevo componente
src/components/MiComponente.tsx
src/components/MiComponente.test.tsx
```

### 3. Agregar Tests a tus Funciones

Para cualquier función de lógica de negocio:

```bash
# Para una nueva función
src/logic/miFuncion.ts
src/logic/miFuncion.test.ts
```

## Assertions Más Comunes

```typescript
// Igualdad
expect(valor).toBe(5);
expect(objeto).toEqual({ id: 1 });

// Existencia
expect(elemento).toBeDefined();
expect(elemento).not.toBeNull();

// Texto
expect(texto).toContain("palabra");
expect(screen.getByText("Hola")).toBeDefined();

// Arrays
expect(array).toHaveLength(3);

// Booleanos
expect(condicion).toBeTruthy();

// Excepciones
expect(() => divide(10, 0)).toThrow();
```

## Tips de Productividad

### Durante el Desarrollo

```bash
# Mantén los tests corriendo en una terminal
npm test

# En otra terminal, desarrolla normalmente
npm run dev
```

### Antes de Commit

```bash
# Asegúrate de que todos los tests pasen
npm run test:run

# Opcional: revisa la cobertura
npm run test:coverage
```

### En Modo Watch

Cuando ejecutas `npm test`, presiona:

- `a` - Ejecutar todos los tests
- `f` - Solo tests que fallaron
- `t` - Filtrar por nombre
- `q` - Salir

## Troubleshooting

### "Cannot find module vitest"

```bash
npm install
```

### "jsdom is not defined"

```bash
npm install -D jsdom
```

### Tests no se actualizan

```bash
npx vitest --clearCache
npm test
```

## Contacto y Ayuda

- Documentación completa: `README_TESTING.md`
- Comandos: `COMANDOS_TESTING.md`
- Estructura: `ESTRUCTURA_TESTING.md`

## Resumen de Archivos Modificados

### Actualizados

- `package.json` - Dependencias y scripts
- `vite.config.js` - Configuración de testing
- `.gitignore` - Carpetas de testing

### Creados

- 6 archivos de tests (`.test.ts` / `.test.tsx`)
- 3 archivos helper (`.helper.ts`)
- 1 archivo de setup (`setup.ts`)
- 1 componente de ejemplo (`ItemCounter.tsx`)
- 4 archivos de documentación

## ¡Listo para Empezar!

```bash
# 1. Instala
npm install

# 2. Ejecuta
npm test

# 3. ¡Desarrolla con confianza!


```
