# Comandos de Testing - Level Up React

## Comandos Principales

### Ejecutar todos los tests en modo watch

```bash
npm test
```

Ejecuta los tests y se mantiene observando cambios en los archivos.

### Ejecutar tests una sola vez

```bash
npm run test:run
```

Ejecuta todos los tests y termina.

### Abrir interfaz gráfica de Vitest

```bash
npm run test:ui
```

Abre una interfaz web interactiva para ver y ejecutar tests.

### Generar reporte de cobertura

```bash
npm run test:coverage
```

Genera un reporte HTML de cobertura en la carpeta `coverage/`.

## Comandos Avanzados

### Ejecutar un archivo específico

```bash
npx vitest src/helpers/math.helper.test.ts
```

### Ejecutar tests con un patrón específico

```bash
npx vitest --grep "Calculadora"
```

### Modo debug

```bash
npx vitest --inspect-brk
```

### Ver salida detallada

```bash
npm test -- --reporter=verbose
```

### Ejecutar tests en paralelo

```bash
npm test -- --threads
```

### Actualizar snapshots

```bash
npm test -- -u
```

## Ejemplos de Uso

### 1. Desarrollo normal

Durante el desarrollo, mantén los tests corriendo:

```bash
npm test
```

### 2. Antes de commit

Ejecuta todos los tests para asegurar que pasan:

```bash
npm run test:run
```

### 3. Revisar cobertura

```bash
npm run test:coverage
# Luego abre coverage/index.html en tu navegador
```

### 4. Debugging de un test específico

```bash
npx vitest src/logic/carrito.test.ts
```

## Estructura de Salida

### Output básico

```
✓ src/helpers/math.helper.test.ts (12)
  ✓ Calculadora - Suma (3)
    ✓ Debo sumar dos numeros positivos
    ✓ Debo sumar dos numeros negativos
    ✓ Debo sumar un numero positivo y uno negativo
  ✓ Calculadora - Resta (2)
    ✓ Debo restar dos numeros positivos
    ✓ Debo restar dos numeros negativos

Test Files  1 passed (1)
     Tests  12 passed (12)
  Start at  10:30:45
  Duration  324ms
```

### Output con errores

```
✗ src/logic/carrito.test.ts (1)
  ✗ Debe calcular el total correctamente
    Expected: 40000
    Received: 30000
```

## Atajos de Teclado en Modo Watch

- `a` - Ejecutar todos los tests
- `f` - Ejecutar solo tests que fallaron
- `t` - Filtrar por nombre del test
- `p` - Filtrar por nombre de archivo
- `q` - Salir

## Tips de Performance

### Ejecutar solo archivos modificados

```bash
npm test -- --changed
```

### Limitar threads

```bash
npm test -- --threads=4
```

### Deshabilitar cobertura (más rápido)

```bash
npm test -- --coverage=false
```

## Integración con CI/CD

### GitHub Actions

```yaml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage
```

### GitLab CI

```yaml
test:
  script:
    - npm install
    - npm run test:run
    - npm run test:coverage
```

## Troubleshooting

### Tests no se ejecutan

```bash
# Limpiar cache
npx vitest --clearCache

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Problemas con jsdom

```bash
# Asegurar que jsdom está instalado
npm install -D jsdom
```

### Problemas con snapshots

```bash
# Actualizar todos los snapshots
npm test -- -u

# Ver diferencias
npm test -- --reporter=verbose
```

## Comandos de Limpieza

### Limpiar cache de Vitest

```bash
npx vitest --clearCache
```

### Eliminar reportes de cobertura

```bash
rm -rf coverage/
```

### Eliminar snapshots obsoletos

```bash
npm test -- --updateSnapshot
```
