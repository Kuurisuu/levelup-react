import React, { useState, useMemo } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import AlertCard from '../components/AlertCard';
import WidgetCard from '../components/WidgetCard';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import ProductRanking from '../components/charts/ProductRanking';
import ServerStatus from '../components/widgets/ServerStatus';
import ActivityFeed from '../components/widgets/ActivityFeed';
import PerformanceMetrics from '../components/widgets/PerformanceMetrics';
import PythonAnalysisDashboard from '../components/python/PythonAnalysisDashboard';
import { useDashboardData, useUserGrowthSimulation, useCalculatedMetrics } from '../hooks/useDashboardData';
import { obtenerProductos } from '../data/catalogo';
import '../styles/admin.css';

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'8days' | '1month' | '1year'>('8days');
  
  const {
    metrics,
    serverStatus,
    activities,
    topProducts,
    loading,
    error,
    lastUpdate,
    refreshData
  } = useDashboardData();

  const { users, isGrowing, startGrowth, stopGrowth, resetUsers } = useUserGrowthSimulation();
  const calculatedMetrics = useCalculatedMetrics(metrics);

  const [simulationRunning, setSimulationRunning] = useState(false);

  // Calcular categorías dinámicamente desde el catálogo
  const categoryData = useMemo(() => {
    const productos = obtenerProductos();
    
    // Agrupar productos por categoría
    const categoriasMap = new Map();
    
    productos.forEach(producto => {
      const categoriaNombre = producto.categoria?.nombre || 'Sin categoría';
      const subcategoriaNombre = producto.subcategoria?.nombre || 'General';
      
      if (!categoriasMap.has(categoriaNombre)) {
        categoriasMap.set(categoriaNombre, {
          nombre: categoriaNombre,
          productos: 0,
          ventasSimuladas: 0,
          subcategorias: new Map()
        });
      }
      
      const categoria = categoriasMap.get(categoriaNombre);
      categoria.productos += 1;
      
      // Simular ventas basadas en precio y disponibilidad
      const ventasSimuladas = Math.floor(
        (producto.precio || 0) * 
        (producto.disponible ? 1 : 0.3) * 
        (Math.random() * 50 + 10) // Factor aleatorio de popularidad
      );
      
      categoria.ventasSimuladas += ventasSimuladas;
      
      // Contar subcategorías
      if (!categoria.subcategorias.has(subcategoriaNombre)) {
        categoria.subcategorias.set(subcategoriaNombre, 0);
      }
      categoria.subcategorias.set(subcategoriaNombre, categoria.subcategorias.get(subcategoriaNombre) + 1);
    });
    
    // Convertir a array y ordenar por ventas
    const categoriasArray = Array.from(categoriasMap.values())
      .sort((a, b) => b.ventasSimuladas - a.ventasSimuladas)
      .slice(0, 4); // Top 4 categorías
    
    // Calcular total de ventas
    const totalVentas = categoriasArray.reduce((sum, cat) => sum + cat.ventasSimuladas, 0);
    
    // Calcular porcentajes y colores
    return categoriasArray.map((categoria, index) => {
      const porcentaje = totalVentas > 0 ? (categoria.ventasSimuladas / totalVentas) * 100 : 0;
      
      // Colores dinámicos basados en intensidad de ventas
      const intensidad = Math.min(porcentaje / 25, 1); // Normalizar a 0-1
      const colores = [
        `hsl(220, ${60 + intensidad * 40}%, ${50 + intensidad * 20}%)`, // Azul más intenso
        `hsl(200, ${60 + intensidad * 40}%, ${50 + intensidad * 20}%)`, // Azul claro más intenso
        `hsl(180, ${60 + intensidad * 40}%, ${50 + intensidad * 20}%)`, // Cyan más intenso
        `hsl(160, ${60 + intensidad * 40}%, ${50 + intensidad * 20}%)`  // Verde azulado más intenso
      ];
      
      return {
        ...categoria,
        porcentaje: Math.round(porcentaje * 10) / 10,
        color: colores[index] || `hsl(220, 70%, 60%)`,
        ventasFormateadas: new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0
        }).format(categoria.ventasSimuladas)
      };
    });
  }, []);

  // Calcular total de ventas formateado
  const totalVentasFormateado = useMemo(() => {
    const total = categoryData.reduce((sum, cat) => sum + cat.ventasSimuladas, 0);
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(total);
  }, [categoryData]);

  // Calcular métricas del Monthly Target
  const monthlyTargetData = useMemo(() => {
    const productos = obtenerProductos();
    const totalProductos = productos.length;
    const productosDisponibles = productos.filter(p => p.disponible).length;
    
    // Simular ventas del mes basadas en productos disponibles
    const ventasSimuladas = productosDisponibles * 15000; // $15,000 promedio por producto
    const targetMensual = totalProductos * 20000; // $20,000 target por producto
    
    const porcentajeCompletado = Math.min((ventasSimuladas / targetMensual) * 100, 100);
    const crecimientoMesAnterior = Math.random() * 15 + 5; // 5-20% crecimiento
    
    return {
      porcentaje: Math.round(porcentajeCompletado * 10) / 10,
      crecimiento: Math.round(crecimientoMesAnterior * 100) / 100,
      ventasActuales: ventasSimuladas,
      target: targetMensual,
      incremento: ventasSimuladas - (ventasSimuladas / (1 + crecimientoMesAnterior / 100))
    };
  }, []);

  // Datos dinámicos para Revenue Analytics basados en el período seleccionado
  const revenueAnalyticsData = useMemo(() => {
    const productos = obtenerProductos();
    const baseRevenue = productos.reduce((sum, p) => sum + (p.precio || 0), 0);
    const baseOrders = productos.length * 2;
    
    // Configuración según el período
    const periodConfig = {
      '8days': { days: 8, labelFormat: 'day', multiplier: 0.1 },
      '1month': { days: 4, labelFormat: 'week', multiplier: 0.3 },
      '1year': { days: 12, labelFormat: 'month', multiplier: 1.0 }
    };
    
    const config = periodConfig[selectedPeriod];
    const revenueData = [];
    const orderData = [];
    const labels = [];
    
    for (let i = config.days - 1; i >= 0; i--) {
      if (config.labelFormat === 'day') {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }));
      } else if (config.labelFormat === 'week') {
        labels.push(`Sem ${config.days - i}`);
      } else if (config.labelFormat === 'month') {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        labels.push(date.toLocaleDateString('es-CL', { month: 'short' }));
      }
      
      // Simular variaciones según el período
      const revenueVariation = (Math.random() - 0.5) * 0.3;
      const orderVariation = (Math.random() - 0.5) * 0.4;
      
      const dailyRevenue = baseRevenue * (1 + revenueVariation) * config.multiplier;
      const dailyOrders = Math.floor(baseOrders * (1 + orderVariation) * config.multiplier);
      
      revenueData.push(Math.round(dailyRevenue));
      orderData.push(dailyOrders);
    }
    
    const maxRevenue = Math.max(...revenueData);
    const maxOrders = Math.max(...orderData);
    
    return {
      revenueData,
      orderData,
      labels,
      maxRevenue,
      maxOrders,
      totalRevenue: revenueData.reduce((sum, val) => sum + val, 0),
      totalOrders: orderData.reduce((sum, val) => sum + val, 0)
    };
   }, [selectedPeriod]);

   // Datos dinámicos para Active User basados en regiones de Chile
   const activeUserData = useMemo(() => {
     const baseUsers = 2758;
     const regions = [
       { name: 'Región Metropolitana', basePercentage: 85, variation: 0.1 },
       { name: 'Valparaíso', basePercentage: 60, variation: 0.15 },
       { name: 'Biobío', basePercentage: 40, variation: 0.2 },
       { name: 'La Araucanía', basePercentage: 25, variation: 0.25 },
       { name: 'Antofagasta', basePercentage: 20, variation: 0.3 },
       { name: 'Coquimbo', basePercentage: 15, variation: 0.35 }
     ];

     return regions.map(region => {
       // Simular variación en el porcentaje
       const variation = (Math.random() - 0.5) * region.variation;
       const percentage = Math.max(5, Math.min(95, region.basePercentage + (variation * 100)));
       
       return {
         ...region,
         percentage: Math.round(percentage * 10) / 10,
         users: Math.round((percentage / 100) * baseUsers)
       };
     });
   }, []);

  // Datos dinámicos para Traffic Sources
  const trafficSourcesData = useMemo(() => {
    const baseMultiplier = selectedPeriod === '8days' ? 0.1 : selectedPeriod === '1month' ? 0.3 : 1.0;
    
    const sources = [
      { name: 'Búsquedas Orgánicas', basePercentage: 30, variation: 0.20 },
      { name: 'Campañas de Correo Electrónico', basePercentage: 30, variation: 0.08 },
      { name: 'Tráfico Directo', basePercentage: 20, variation: 0.25 },
      { name: 'Redes Sociales', basePercentage: 15, variation: 0.15 },
      { name: 'Enlaces Externos', basePercentage: 5, variation: 0.10 }
    ];

    return sources.map(source => {
      // Generar variación más dramática
      const variation = (Math.random() - 0.5) * source.variation * baseMultiplier;
      const percentage = Math.max(0.5, Math.min(60, source.basePercentage + variation));
      
      return {
        ...source,
        percentage: Math.round(percentage * 10) / 10
      };
    }).sort((a, b) => b.percentage - a.percentage); // Ordenar por porcentaje descendente
  }, [selectedPeriod]);

  // Datos dinámicos para Conversion Rate (embudo de conversión)
  const conversionRateData = useMemo(() => {
    const baseMultiplier = selectedPeriod === '8days' ? 0.1 : selectedPeriod === '1month' ? 0.3 : 1.0;
    
    const steps = [
       { name: 'Vistas de Productos', basePercentage: 100, baseValue: 25000, variation: 0.1 },
       { name: 'Agregar al Carrito', basePercentage: 80, baseValue: 20000, variation: 0.15 },
       { name: 'Proceder al Pago', basePercentage: 60, baseValue: 15000, variation: 0.2 },
       { name: 'Compras Completadas', basePercentage: 40, baseValue: 10000, variation: 0.25 },
       { name: 'Carritos Abandonados', basePercentage: 20, baseValue: 5000, variation: 0.3 }
     ];

     return steps.map(step => {
       // Simular variación en el porcentaje y valor
       const percentageVariation = (Math.random() - 0.5) * step.variation;
       const valueVariation = (Math.random() - 0.5) * step.variation;
       
       const percentage = Math.max(5, Math.min(100, step.basePercentage + (percentageVariation * 100)));
       const value = Math.round(step.baseValue * (1 + valueVariation) * baseMultiplier);
       
       // Calcular cambio porcentual
       const change = Math.round((Math.random() - 0.3) * 20); // -6% a +14%
       
       return {
         ...step,
         percentage: Math.round(percentage * 10) / 10,
         value: value,
         change: change,
         isPositive: change >= 0
       };
     });
   }, [selectedPeriod]);

   const handleStartSimulation = () => {
    setSimulationRunning(true);
    startGrowth();
  };

  const handleStopSimulation = () => {
    setSimulationRunning(false);
    stopGrowth();
  };

  const handleRefreshData = () => {
    refreshData();
  };

  // Función para formatear números
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  // Función para formatear moneda
  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(num);
  };

  if (loading) {
    return (
      <div className="wrapper">
        <main>
          <div className="admin-layout">
            <DashboardSidebar />
            <main className="admin-content">
              <div className="loading-container">
                <h1>Cargando Dashboard...</h1>
                <div className="loading-spinner"></div>
                <p>Simulando llamadas al backend...</p>
              </div>
            </main>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper">
        <main>
          <div className="admin-layout">
            <DashboardSidebar />
            <main className="admin-content">
              <div className="error-container">
                <h1>Error al cargar datos</h1>
                <p>{error}</p>
                <button onClick={handleRefreshData} className="btn-refresh">
                  Reintentar
                </button>
              </div>
            </main>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <main>
        <div className="admin-layout">
          <DashboardSidebar />

                <main className="admin-content">
                  {/* Header del Dashboard */}
                  <div className="dashboard-main-header">
                    <div className="dashboard-title">
                      <h1>Dashboard</h1>
                    </div>
                  </div>
            
                  {/* KPIs Principales */}
                  <div className="main-kpi-grid">
                    <div className="kpi-card-main">
                      <div className="kpi-content-main">
                        <div className="kpi-value-main">
                          <span className="kpi-number">$983,410</span>
                        </div>
                        <div className="kpi-change-main positive">
                          +3.34% vs semana pasada
                        </div>
                      </div>
                      <div className="kpi-icon-main sales">
                        <i className="bi bi-currency-dollar"></i>
                      </div>
                    </div>
                    
                    <div className="kpi-card-main">
                      <div className="kpi-content-main">
                        <div className="kpi-value-main">
                          <span className="kpi-number">58,375</span>
                        </div>
                        <div className="kpi-change-main negative">
                          -2.89% vs semana pasada
                        </div>
                      </div>
                      <div className="kpi-icon-main orders">
                        <i className="bi bi-cart"></i>
                      </div>
                    </div>
                    
                    <div className="kpi-card-main">
                      <div className="kpi-content-main">
                        <div className="kpi-value-main">
                          <span className="kpi-number">237,782</span>
                        </div>
                        <div className="kpi-change-main positive">
                          +8.02% vs semana pasada
                        </div>
                      </div>
                      <div className="kpi-icon-main visitors">
                        <i className="bi bi-people"></i>
                      </div>
                    </div>
                  </div>

                  {/* Grid Principal del Dashboard */}
                  <div className="dashboard-main-grid">
                    {/* Revenue Analytics */}
                    <div className="dashboard-card revenue-analytics">
                      <div className="card-header">
                        <h3>Análisis de Ingresos</h3>
                        <div className="date-selector">
                          <select 
                            className="date-dropdown"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value as '8days' | '1month' | '1year')}
                          >
                            <option value="8days">Últimos 8 días</option>
                            <option value="1month">Último mes</option>
                            <option value="1year">Último año</option>
                          </select>
                        </div>
                      </div>
                      <div className="revenue-chart">
                        <div className="chart-legend">
                          <div className="legend-item">
                            <div className="legend-line solid"></div>
                            <span>Ingresos</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-line dashed"></div>
                            <span>Pedidos</span>
                          </div>
                        </div>
                        <div className="line-chart-container">
                          <svg className="revenue-svg" viewBox="0 0 800 180" preserveAspectRatio="xMidYMid meet">
                            <defs>
                              <pattern id="grid" width="80" height="18" patternUnits="userSpaceOnUse">
                                <rect width="80" height="18" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.6"/>
                              </pattern>
                            </defs>
                            <rect x="0" y="0" width="800" height="180" fill="url(#grid)" opacity="0.3" />
                            
                            {/* Línea de Revenue */}
                            <path 
                              d={revenueAnalyticsData.revenueData.map((value, index) => {
                                const totalPoints = revenueAnalyticsData.revenueData.length;
                                const x = 40 + (index * (720 / Math.max(totalPoints - 1, 1)));
                                const y = 140 - ((value / revenueAnalyticsData.maxRevenue) * 100);
                                return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                              }).join(' ')}
                              stroke="var(--accent-blue)" 
                              strokeWidth="3" 
                              fill="none" 
                              className="revenue-line"
                            />
                            
                            {/* Línea de Orders */}
                            <path 
                              d={revenueAnalyticsData.orderData.map((value, index) => {
                                const totalPoints = revenueAnalyticsData.orderData.length;
                                const x = 40 + (index * (720 / Math.max(totalPoints - 1, 1)));
                                const y = 140 - ((value / revenueAnalyticsData.maxOrders) * 100);
                                return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                              }).join(' ')}
                              stroke="var(--accent-blue)" 
                              strokeWidth="2" 
                              fill="none" 
                              strokeDasharray="5,5" 
                              className="order-line"
                            />
                            
                            {/* Puntos de datos */}
                            {revenueAnalyticsData.revenueData.map((value, index) => {
                              const totalPoints = revenueAnalyticsData.revenueData.length;
                              const x = 40 + (index * (720 / Math.max(totalPoints - 1, 1)));
                              const y = 140 - ((value / revenueAnalyticsData.maxRevenue) * 100);
                              return (
                                <circle 
                                  key={index}
                                  cx={x} 
                                  cy={y} 
                                  r="3" 
                                  fill="var(--accent-blue)" 
                                  className="data-point"
                                />
                              );
                            })}
                            
                            {/* Punto destacado del último día */}
                            {revenueAnalyticsData.revenueData.length > 0 && (
                              <>
                                <circle 
                                  cx={40 + ((revenueAnalyticsData.revenueData.length - 1) * (720 / Math.max(revenueAnalyticsData.revenueData.length - 1, 1)))} 
                                  cy={140 - ((revenueAnalyticsData.revenueData[revenueAnalyticsData.revenueData.length - 1] / revenueAnalyticsData.maxRevenue) * 100)} 
                                  r="5" 
                                  fill="var(--accent-blue)" 
                                  className="highlight-point"
                                />
                                <text 
                                  x={40 + ((revenueAnalyticsData.revenueData.length - 1) * (720 / Math.max(revenueAnalyticsData.revenueData.length - 1, 1)))} 
                                  y={140 - ((revenueAnalyticsData.revenueData[revenueAnalyticsData.revenueData.length - 1] / revenueAnalyticsData.maxRevenue) * 100) - 15} 
                                  textAnchor="middle" 
                                  className="tooltip"
                                >
                                  Ingresos {new Intl.NumberFormat('es-CL', {
                                    style: 'currency',
                                    currency: 'CLP',
                                    minimumFractionDigits: 0
                                  }).format(revenueAnalyticsData.revenueData[revenueAnalyticsData.revenueData.length - 1])}
                                </text>
                              </>
                            )}
                          </svg>
                        </div>
                        <div className="chart-labels">
                          {revenueAnalyticsData.labels.map((label, index) => {
                            const totalPoints = revenueAnalyticsData.labels.length;
                            const xPosition = 40 + (index * (720 / Math.max(totalPoints - 1, 1)));
                            const percentagePosition = (xPosition / 800) * 100; // Convertir a porcentaje del SVG más ancho
                            
                            return (
                              <span 
                                key={index} 
                                className="chart-label-item"
                                style={{ 
                                  position: 'absolute',
                                  left: `${percentagePosition}%`,
                                  top: '0.2rem',
                                  transform: 'translateX(-50%)',
                                  fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
                                  color: 'var(--text-muted)',
                                  fontWeight: '500',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Monthly Target */}
                    <div className="dashboard-card monthly-target">
                      <div className="card-header">
                        <h3>Meta Mensual</h3>
                        <div className="card-menu">
                          <i className="bi bi-three-dots"></i>
                        </div>
                      </div>
                      <div className="donut-chart-container">
                        <div className="semi-circle-progress">
                          <svg viewBox="0 0 300 150" className="semi-circle-svg">
                            {/* Fondo del semicírculo */}
                            <path
                              d="M 50 120 A 100 100 0 0 1 250 120"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="20"
                              strokeLinecap="round"
                            />
                            {/* Barra de progreso */}
                            <path
                              d="M 50 120 A 100 100 0 0 1 250 120"
                              fill="none"
                              stroke="var(--accent-blue)"
                              strokeWidth="25"
                              strokeLinecap="round"
                              strokeDasharray="314"
                              strokeDashoffset={314 - (monthlyTargetData.porcentaje / 100) * 314}
                              className="progress-arc"
                              style={{
                                transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
                              }}
                            />
                          </svg>
                          <div className="progress-center">
                            <span className="percentage">{monthlyTargetData.porcentaje}%</span>
                            <span className="change positive">+{monthlyTargetData.crecimiento}% del mes pasado</span>
                          </div>
                        </div>
                        <div className="target-message">
                          <div className="success-message">
                            <span>¡Excelente Progreso!</span>
                            <span className="emoji">🎉</span>
                          </div>
                          <p>
                            Nuestro logro aumentó en{' '}
                            <span className="highlight-amount">
                              {new Intl.NumberFormat('es-CL', {
                                style: 'currency',
                                currency: 'CLP',
                                minimumFractionDigits: 0
                              }).format(monthlyTargetData.incremento)}
                            </span>
                            ; ¡alcanzemos el 100% el próximo mes.
                          </p>
                        </div>
                        <div className="target-metrics">
                          <div className="metric-rectangle target-rect">
                            <span className="metric-label">Meta</span>
                            <span className="metric-value">
                              {new Intl.NumberFormat('es-CL', {
                                style: 'currency',
                                currency: 'CLP',
                                minimumFractionDigits: 0
                              }).format(monthlyTargetData.target)}
                            </span>
                          </div>
                          <div className="metric-rectangle revenue-rect">
                            <span className="metric-label">Ingresos</span>
                            <span className="metric-value">
                              {new Intl.NumberFormat('es-CL', {
                                style: 'currency',
                                currency: 'CLP',
                                minimumFractionDigits: 0
                              }).format(monthlyTargetData.ventasActuales)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Categories */}
                    <div className="dashboard-card top-categories">
                      <div className="card-header">
                        <h3>Top Categorías</h3>
                        <a href="#" className="see-all-link">Ver Todo</a>
                      </div>
                      <div className="categories-content">
                        <div className="categories-donut">
                          <svg viewBox="0 0 120 120" className="categories-svg">
                            {categoryData.map((categoria, index) => {
                              const circumference = 2 * Math.PI * 50; // Radio 50
                              const strokeDasharray = circumference;
                              const strokeDashoffset = circumference - (categoria.porcentaje / 100) * circumference;
                              const rotation = categoryData.slice(0, index).reduce((sum, cat) => sum + (cat.porcentaje / 100) * 360, 0);
                              
                              return (
                                <circle
                                  key={categoria.nombre}
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  fill="none"
                                  stroke={categoria.color}
                                  strokeWidth="8"
                                  strokeDasharray={strokeDasharray}
                                  strokeDashoffset={strokeDashoffset}
                                  transform={`rotate(${rotation} 60 60)`}
                                  className="category-segment"
                                  style={{
                                    transition: 'all 0.8s ease',
                                    filter: `drop-shadow(0 2px 4px ${categoria.color}40)`
                                  }}
                                />
                              );
                            })}
                          </svg>
                          <div className="donut-center">
                            <span className="total-sales">Ventas Totales</span>
                            <span className="sales-amount">{totalVentasFormateado}</span>
                          </div>
                        </div>
                        <div className="categories-list">
                          {categoryData.map((categoria, index) => (
                            <div key={categoria.nombre} className="category-item">
                              <div 
                                className="category-color" 
                                style={{ backgroundColor: categoria.color }}
                              ></div>
                              <span className="category-name">{categoria.nombre}</span>
                              <span className="category-value">{categoria.ventasFormateadas}</span>
                              <span className="category-percentage">({categoria.porcentaje}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                     {/* Active User */}
                     <div className="dashboard-card active-user">
                       <div className="card-header">
                         <h3>Usuarios Activos</h3>
                         <button 
                           className="refresh-btn"
                           onClick={() => window.location.reload()}
                           title="Actualizar datos"
                         >
                           <i className="bi bi-arrow-clockwise"></i>
                         </button>
                       </div>
                       <div className="active-user-content">
                         <div className="user-stats">
                           <span className="user-number">2,758</span>
                           <span className="user-label">Usuarios</span>
                           <span className="user-change positive">+8.02% del mes pasado</span>
                         </div>
                         <div className="country-bars">
                           {activeUserData.map((country, index) => (
                             <div key={country.name} className="country-item">
                               <span className="country-name">{country.name}</span>
                               <div className="progress-bar">
                                 <div 
                                   className="progress-fill" 
                                   style={{
                                     width: `${country.percentage}%`,
                                     transition: 'width 0.8s ease-in-out',
                                     animationDelay: `${index * 0.1}s`
                                   }}
                                 ></div>
                               </div>
                               <span className="country-percentage">{country.percentage}%</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>

                    {/* Conversion Rate */}
                    <div className="dashboard-card conversion-rate">
                      <div className="card-header">
                        <h3>Tasa de Conversión</h3>
                        <div className="date-selector">
                          <select 
                            className="date-dropdown"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value as '8days' | '1month' | '1year')}
                          >
                            <option value="8days">Esta semana</option>
                            <option value="1month">Este mes</option>
                            <option value="1year">Este año</option>
                          </select>
                        </div>
                      </div>
                      <div className="conversion-funnel">
                        {conversionRateData.map((step, index) => (
                          <div key={step.name} className="funnel-step">
                            <div 
                              className={`step-bar ${step.name === 'Abandoned Carts' ? 'abandoned' : ''}`}
                              style={{
                                height: `${step.percentage}%`,
                                transition: 'height 0.8s ease-in-out',
                                animationDelay: `${index * 0.1}s`
                              }}
                            ></div>
                            <div className="step-info">
                              <span className="step-number">{step.value.toLocaleString()}</span>
                              <span className={`step-change ${step.isPositive ? 'positive' : 'negative'}`}>
                                {step.isPositive ? '+' : ''}{step.change}%
                              </span>
                              <span className="step-label">{step.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Traffic Sources */}
                    <div className="dashboard-card traffic-sources">
                      <div className="card-header">
                        <h3>Fuentes de Tráfico</h3>
                      </div>
                      <div className="traffic-container">
                        <div className="traffic-bar-container">
                          <div className="traffic-segments">
                            {trafficSourcesData.map((source, index) => {
                              // Sistema de colores dinámico basado en porcentaje real
                              const intensidad = Math.min(source.percentage / 30, 1); // Normalizar a 0-1 (más sensible)
                              
                              // Colores que van del azul al verde según el porcentaje
                              const hue = 220 - (source.percentage / 60) * 80; // De 220 (azul) a 140 (verde)
                              const saturation = 60 + intensidad * 40; // 60% a 100%
                              const lightness = 50 + intensidad * 20; // 50% a 70%
                              
                              const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                              
                              console.log(`Fuente de Tráfico ${source.name}: ${source.percentage}%, Color: ${color}, Hue: ${hue}, Intensidad: ${intensidad}`);
                              
                              return (
                                <div 
                                  key={source.name}
                                  className="traffic-segment"
                                  style={{
                                    width: `${source.percentage}%`,
                                    backgroundColor: color,
                                    background: `linear-gradient(90deg, ${color}, ${color}dd)`
                                  }}
                                ></div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="traffic-legend">
                          {trafficSourcesData.map((source, index) => {
                            // Sistema de colores dinámico basado en porcentaje real
                            const intensidad = Math.min(source.percentage / 30, 1); // Normalizar a 0-1 (más sensible)
                            
                            // Colores que van del azul al verde según el porcentaje
                            const hue = 220 - (source.percentage / 60) * 80; // De 220 (azul) a 140 (verde)
                            const saturation = 60 + intensidad * 40; // 60% a 100%
                            const lightness = 50 + intensidad * 20; // 50% a 70%
                            
                            const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                            
                            console.log(`Legend ${source.name}: Color: ${color}, Hue: ${hue}, Intensidad: ${intensidad}`);
                            
                            return (
                              <div key={source.name} className="traffic-legend-item">
                                <div 
                                  className="traffic-color-indicator"
                                  style={{
                                    backgroundColor: color,
                                    background: color
                                  }}
                                ></div>
                                <span className="traffic-source-name">{source.name}</span>
                                <span className="traffic-source-percentage">{source.percentage}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                </main>
              </div>
            </main>
          </div>
        );
      };

      export default AdminDashboard;
