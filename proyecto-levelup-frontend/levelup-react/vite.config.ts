import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/test/**',
        'src/**/__tests__/**',
        'src/**/__snapshots__/**',
        'src/components/ChartCard.tsx',
        'src/components/DashboardSidebar.tsx',
        'src/components/KPICard.tsx',
        'src/components/Reports/**',
        'src/components/charts/**',
        'src/components/dashboard/**',
        'src/components/python/**',
        'src/components/widgets/**',
        'src/hooks/**',
        'src/data/dashboardSimulation.ts',
        'src/data/pythonAnalysisSimulation.ts',
        'src/pages/Admin.tsx',
        'src/pages/AdminCategorias.tsx',
        'src/pages/AdminDashboard.tsx',
        'src/pages/AdminOrdenes.tsx',
        'src/pages/AdminProductos.tsx',
        'src/pages/AdminReportes.tsx',
        'src/pages/AdminUsuarios.tsx',
        'src/types/reports.ts',
        'src/utils/checkout.helper.ts',
        'src/utils/orden.helper.ts',
        'src/utils/pdf.helper.ts',
        'src/logic/useFiltros_new.ts',
        'src/components/Checkout/**',
        'src/components/ProductoDetalle/**',
        'src/components/Profile/**',
        'src/pages/Checkout.tsx',
        'src/pages/Eventos.tsx',
        'src/pages/GamingHub.tsx',
        'src/pages/Nosotros.tsx',
        'src/pages/Producto.tsx',
        'src/pages/ProductoDetalle.tsx',
        'src/pages/Profile.tsx',
        'src/App.tsx',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/data/catalogo.ts',
        'src/logic/carrito.ts',
        'src/utils/format.helper.ts',
        'src/utils/priceUtils.ts',
        'src/utils/ratingUtils.ts',
        'src/utils/regiones.ts',
        'src/logic/auth.ts',
        'src/logic/storage.ts',
        'src/logic/useFiltros.ts'
      ],
      thresholds: {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50
        }
      }
    }
  }
})