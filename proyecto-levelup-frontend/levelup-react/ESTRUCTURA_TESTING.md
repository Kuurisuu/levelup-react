# Estructura de Testing - Level Up React

## Árbol de Archivos Creados

```
levelup-react/
├── src/
│   ├── components/
│   │   ├── ItemCounter.tsx                    # Componente de ejemplo para testing
│   │   ├── ItemCounter.test.tsx               # Tests del componente ItemCounter
│   │   └── ProductoCard.test.tsx              # Tests del componente ProductoCard
│   │
│   ├── helpers/
│   │   ├── math.helper.ts                     # Funciones matemáticas de ejemplo
│   │   └── math.helper.test.ts                # Tests de funciones matemáticas
│   │
│   ├── logic/
│   │   ├── carrito.test.ts                    # Tests de lógica del carrito
│   │   └── storage.test.ts                    # Tests de localStorage
│   │
│   ├── utils/
│   │   ├── format.helper.ts                   # Helpers de formateo
│   │   └── format.helper.test.ts              # Tests de helpers de formateo
│   │
│   └── tests/
│       └── setup.ts                           # Configuración inicial de tests
│
├── vitest.config.js                           # Configuración de Vitest
├── package.json                               # Dependencias actualizadas
├── README_TESTING.md                          # Guía completa de testing
├── COMANDOS_TESTING.md                        # Referencia de comandos
└── ESTRUCTURA_TESTING.md                      # Este archivo
```

## Resumen de Archivos

### Configuración

#### `vitest.config.js`

Configuración principal de Vitest con:

- Entorno jsdom para simular el DOM
- Variables globales habilitadas
- Configuración de cobertura
- Setup files

#### `src/tests/setup.ts`

- Mock de localStorage
- Limpieza antes de cada test
- Configuraciones globales

### Tests de Funciones

#### `src/helpers/math.helper.test.ts`

Tests de ejemplo con funciones matemáticas:

- ✓ Suma, resta, multiplicación, división
- ✓ Cálculo de porcentajes
- ✓ Aplicación de descuentos
- **12 tests en total**

#### `src/utils/format.helper.test.ts`

Tests de funciones de formateo:

- ✓ Formato de moneda CLP
- ✓ Capitalización de texto
- ✓ Truncado de texto
- ✓ Validación de email
- ✓ Validación y formato de RUT
- ✓ Generación de slugs
- **28 tests en total**

### Tests de Lógica

#### `src/logic/storage.test.ts`

Tests del manejo de localStorage:

- ✓ Obtener carrito vacío
- ✓ Guardar productos
- ✓ Múltiples productos
- ✓ Sobrescribir datos
- ✓ Estructura de datos
- **6 tests en total**

#### `src/logic/carrito.test.ts`

Tests de la lógica del carrito:

- ✓ Obtener productos
- ✓ Agregar productos nuevos
- ✓ Incrementar cantidades
- ✓ Eliminar productos
- ✓ Vaciar carrito
- ✓ Calcular totales
- **13 tests en total**

### Tests de Componentes

#### `src/components/ItemCounter.test.tsx`

Tests de componente de ejemplo:

- ✓ Renderizado inicial
- ✓ Valores personalizados
- ✓ Incrementar contador
- ✓ Decrementar contador
- ✓ Límite mínimo
- ✓ Estilos condicionales
- ✓ Estados de botones
- ✓ Accesibilidad
- ✓ Snapshots
- **10 tests en total**

#### `src/components/ProductoCard.test.tsx`

Tests del componente ProductoCard:

- ✓ Renderizado de título
- ✓ Formato de precio
- ✓ Estados de disponibilidad
- ✓ Botones según disponibilidad
- ✓ Rating con estrellas
- ✓ Eventos onClick
- ✓ Data attributes
- ✓ Imágenes con alt
- ✓ Snapshots
- **11 tests en total**

## Estadísticas

### Total de Tests Creados

- **70 tests** distribuidos en **6 archivos de test**

### Cobertura Esperada

- Funciones: ~95%
- Líneas: ~90%
- Ramas: ~85%

### Tipos de Tests

- **Tests Unitarios**: 59 (funciones puras, lógica de negocio)
- **Tests de Integración**: 11 (componentes con lógica)

## Comandos Rápidos

```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Ver interfaz gráfica
npm run test:ui

# Generar cobertura
npm run test:coverage
```

## Próximos Pasos

Para agregar tests a otros componentes del proyecto:

1. **Filtros.tsx** → `Filtros.test.tsx`

   - Tests de interacción con filtros
   - Cambio de categorías
   - Búsqueda

2. **Header.tsx** → `Header.test.tsx`

   - Navegación
   - Menú móvil
   - Búsqueda

3. **Carrusel.tsx** → `Carrusel.test.tsx`

   - Cambio de slides
   - Navegación
   - Auto-play

4. **ProductoList.tsx** → `ProductoList.test.tsx`
   - Renderizado de lista
   - Filtrado
   - Paginación

## Integración Continua

### Scripts para CI/CD

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install
      - run: npm run test:run
      - run: npm run test:coverage
```

## Buenas Prácticas Implementadas

1. ✓ Patrón AAA en todos los tests
2. ✓ Nombres descriptivos
3. ✓ Tests independientes
4. ✓ Mock de dependencias externas
5. ✓ Limpieza de estado
6. ✓ Tests de snapshots
7. ✓ Tests de accesibilidad
8. ✓ Cobertura configurada
9. ✓ Documentación completa
10. ✓ Comandos útiles

## Recursos Adicionales

- `README_TESTING.md` - Guía completa con ejemplos
- `COMANDOS_TESTING.md` - Referencia rápida de comandos
- Comentarios en código - Explicaciones inline
