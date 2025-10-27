// Simulación de Backend para Dashboard
// Este archivo simula llamadas reales a APIs y cálculos matemáticos

export interface DashboardMetrics {
  sales: {
    daily: number;
    monthly: number;
    dailyChange: number;
    monthlyChange: number;
  };
  users: {
    active: number;
    new: number;
    total: number;
    growthRate: number;
  };
  orders: {
    pending: number;
    completed: number;
    total: number;
    processingTime: number;
  };
  performance: {
    conversion: number;
    responseTime: number;
    satisfaction: number;
  };
}

export interface ServerStatus {
  name: string;
  status: 'online' | 'warning' | 'offline';
  uptime: number;
  responseTime: number;
}

export interface Activity {
  id: string;
  type: 'user' | 'order' | 'product' | 'system';
  description: string;
  timestamp: Date;
  icon: string;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  percentage: number;
}

// Simulación de datos históricos por mes
const historicalData = {
  users: [
    { month: 1, users: 1000, growth: 0 },
    { month: 2, users: 1150, growth: 15 },
    { month: 3, users: 1320, growth: 14.8 },
    { month: 4, users: 1520, growth: 15.2 },
    { month: 5, users: 1750, growth: 15.1 },
    { month: 6, users: 2010, growth: 14.9 },
    { month: 7, users: 2310, growth: 14.9 },
    { month: 8, users: 2650, growth: 14.7 },
    { month: 9, users: 3050, growth: 15.1 },
    { month: 10, users: 3510, growth: 15.1 },
    { month: 11, users: 4040, growth: 15.1 },
    { month: 12, users: 4650, growth: 15.1 }
  ],
  sales: [
    { month: 1, sales: 2500000, growth: 0 },
    { month: 2, sales: 2875000, growth: 15 },
    { month: 3, sales: 3306000, growth: 15 },
    { month: 4, sales: 3802000, growth: 15 },
    { month: 5, sales: 4372000, growth: 15 },
    { month: 6, sales: 5028000, growth: 15 },
    { month: 7, sales: 5782000, growth: 15 },
    { month: 8, sales: 6649000, growth: 15 },
    { month: 9, sales: 7646000, growth: 15 },
    { month: 10, sales: 8793000, growth: 15 },
    { month: 11, sales: 10112000, growth: 15 },
    { month: 12, sales: 11629000, growth: 15 }
  ]
};

// Función para simular crecimiento de usuarios
export const simulateUserGrowth = (baseUsers: number, month: number): number => {
  const growthRate = 0.15; // 15% mensual
  const seasonalFactor = 1 + (Math.sin((month - 1) * Math.PI / 6) * 0.1); // Variación estacional
  const randomFactor = 0.95 + Math.random() * 0.1; // Factor aleatorio ±5%
  
  return Math.floor(baseUsers * Math.pow(1 + growthRate, month - 1) * seasonalFactor * randomFactor);
};

// Función para calcular ventas basadas en usuarios
export const calculateSalesFromUsers = (users: number, month: number): number => {
  const avgPurchasePerUser = 2500; // Promedio de compra por usuario
  const seasonalMultiplier = 1 + (Math.sin((month - 1) * Math.PI / 6) * 0.2); // Variación estacional más pronunciada
  const randomFactor = 0.9 + Math.random() * 0.2; // Factor aleatorio ±10%
  
  return Math.floor(users * avgPurchasePerUser * seasonalMultiplier * randomFactor);
};

// Función para simular métricas del dashboard
export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  const currentMonth = new Date().getMonth() + 1;
  const currentUsers = simulateUserGrowth(1000, currentMonth);
  const currentSales = calculateSalesFromUsers(currentUsers, currentMonth);
  
  // Calcular cambios porcentuales
  const previousUsers = simulateUserGrowth(1000, currentMonth - 1);
  const previousSales = calculateSalesFromUsers(previousUsers, currentMonth - 1);
  
  const dailySales = Math.floor(currentSales / 30);
  const dailyChange = ((dailySales - (previousSales / 30)) / (previousSales / 30)) * 100;
  const monthlyChange = ((currentSales - previousSales) / previousSales) * 100;
  
  return {
    sales: {
      daily: dailySales,
      monthly: currentSales,
      dailyChange: Math.round(dailyChange * 10) / 10,
      monthlyChange: Math.round(monthlyChange * 10) / 10
    },
    users: {
      active: Math.floor(currentUsers * 0.3), // 30% usuarios activos
      new: Math.floor(currentUsers * 0.05), // 5% usuarios nuevos
      total: currentUsers,
      growthRate: Math.round(((currentUsers - previousUsers) / previousUsers) * 100 * 10) / 10
    },
    orders: {
      pending: Math.floor(Math.random() * 30) + 10, // 10-40 órdenes pendientes
      completed: Math.floor(Math.random() * 200) + 100, // 100-300 órdenes completadas
      total: Math.floor(Math.random() * 250) + 150, // 150-400 órdenes totales
      processingTime: Math.floor(Math.random() * 200) + 100 // 100-300ms
    },
    performance: {
      conversion: Math.round((Math.random() * 2 + 2) * 10) / 10, // 2-4%
      responseTime: Math.floor(Math.random() * 100) + 200, // 200-300ms
      satisfaction: Math.round((Math.random() * 0.5 + 4.5) * 10) / 10 // 4.5-5.0
    }
  };
};

// Función para simular estado de servidores
export const fetchServerStatus = async (): Promise<ServerStatus[]> => {
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  const servers = [
    { name: 'Servidor Principal', baseResponseTime: 150 },
    { name: 'Base de Datos', baseResponseTime: 80 },
    { name: 'CDN', baseResponseTime: 200 },
    { name: 'API Gateway', baseResponseTime: 120 },
    { name: 'Cache Redis', baseResponseTime: 50 }
  ];
  
  return servers.map(server => {
    const randomFactor = 0.8 + Math.random() * 0.4; // ±20% variación
    const responseTime = Math.floor(server.baseResponseTime * randomFactor);
    
    let status: 'online' | 'warning' | 'offline' = 'online';
    if (responseTime > server.baseResponseTime * 1.5) status = 'warning';
    if (Math.random() < 0.05) status = 'offline'; // 5% probabilidad de offline
    
    return {
      name: server.name,
      status,
      uptime: Math.round((95 + Math.random() * 5) * 100) / 100, // 95-100%
      responseTime
    };
  });
};

// Función para simular actividades recientes
export const fetchRecentActivities = async (): Promise<Activity[]> => {
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  
  const activities = [
    { type: 'user', description: 'Nuevo usuario registrado', icon: 'bi bi-person-plus' },
    { type: 'order', description: 'Nueva orden procesada', icon: 'bi bi-cart-plus' },
    { type: 'product', description: 'Producto actualizado', icon: 'bi bi-box' },
    { type: 'system', description: 'Backup completado', icon: 'bi bi-shield-check' },
    { type: 'user', description: 'Usuario verificado', icon: 'bi bi-person-check' },
    { type: 'order', description: 'Orden enviada', icon: 'bi bi-truck' }
  ];
  
  const recentActivities: Activity[] = [];
  const now = new Date();
  
  for (let i = 0; i < 5; i++) {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const minutesAgo = Math.floor(Math.random() * 60) + 1;
    const timestamp = new Date(now.getTime() - minutesAgo * 60000);
    
    recentActivities.push({
      id: `activity_${i}_${Date.now()}`,
      type: activity.type as any,
      description: `${activity.description} #${Math.floor(Math.random() * 9999) + 1000}`,
      timestamp,
      icon: activity.icon
    });
  }
  
  return recentActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Función para simular productos más vendidos
export const fetchTopProducts = async (): Promise<TopProduct[]> => {
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  const products = [
    { name: 'Mouse Gaming Pro', baseSales: 250 },
    { name: 'Teclado Mecánico RGB', baseSales: 200 },
    { name: 'Auriculares Gaming', baseSales: 180 },
    { name: 'Monitor 4K Gaming', baseSales: 150 },
    { name: 'Silla Gaming Ergonómica', baseSales: 120 }
  ];
  
  const totalSales = products.reduce((sum, product) => sum + product.baseSales, 0);
  
  return products.map((product, index) => {
    const randomFactor = 0.8 + Math.random() * 0.4; // ±20% variación
    const sales = Math.floor(product.baseSales * randomFactor);
    const revenue = sales * (2000 + Math.random() * 1000); // Precio variable
    const percentage = Math.round((sales / totalSales) * 100);
    
    return {
      id: `product_${index}`,
      name: product.name,
      sales,
      revenue,
      percentage
    };
  }).sort((a, b) => b.sales - a.sales);
};

// Función para simular actualización en tiempo real
export const simulateRealTimeUpdate = (
  callback: (metrics: DashboardMetrics) => void,
  interval: number = 5000
): () => void => {
  let isRunning = true;
  
  const updateLoop = async () => {
    if (!isRunning) return;
    
    try {
      const metrics = await fetchDashboardMetrics();
      callback(metrics);
    } catch (error) {
      console.error('Error en actualización en tiempo real:', error);
    }
    
    if (isRunning) {
      setTimeout(updateLoop, interval);
    }
  };
  
  // Iniciar el loop
  updateLoop();
  
  // Retornar función para detener
  return () => {
    isRunning = false;
  };
};

// Función para simular crecimiento progresivo de usuarios
export const simulateProgressiveUserGrowth = (
  callback: (users: number) => void,
  startUsers: number = 1000,
  increment: number = 10,
  interval: number = 2000
): () => void => {
  let currentUsers = startUsers;
  let isRunning = true;
  
  const growthLoop = () => {
    if (!isRunning) return;
    
    currentUsers += increment;
    callback(currentUsers);
    
    if (isRunning) {
      setTimeout(growthLoop, interval);
    }
  };
  
  // Iniciar el crecimiento
  growthLoop();
  
  // Retornar función para detener
  return () => {
    isRunning = false;
  };
};

// Función para obtener datos históricos
export const getHistoricalData = (metric: 'users' | 'sales', months: number = 12) => {
  return historicalData[metric].slice(0, months);
};

// Función para calcular tendencias
export const calculateTrend = (data: number[]): 'up' | 'down' | 'stable' => {
  if (data.length < 2) return 'stable';
  
  const recent = data.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const previous = data.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
  
  const change = ((recent - previous) / previous) * 100;
  
  if (change > 5) return 'up';
  if (change < -5) return 'down';
  return 'stable';
};
