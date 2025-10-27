import { useState, useEffect, useCallback } from 'react';
import {
  DashboardMetrics,
  ServerStatus,
  Activity,
  TopProduct,
  fetchDashboardMetrics,
  fetchServerStatus,
  fetchRecentActivities,
  fetchTopProducts,
  simulateRealTimeUpdate,
  simulateProgressiveUserGrowth
} from '../data/dashboardSimulation';

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [serverStatus, setServerStatus] = useState<ServerStatus[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Función para cargar todos los datos
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo para simular llamadas reales
      const [metricsData, serverData, activitiesData, productsData] = await Promise.all([
        fetchDashboardMetrics(),
        fetchServerStatus(),
        fetchRecentActivities(),
        fetchTopProducts()
      ]);

      setMetrics(metricsData);
      setServerStatus(serverData);
      setActivities(activitiesData);
      setTopProducts(productsData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error cargando datos del dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar solo las métricas
  const updateMetrics = useCallback(async () => {
    try {
      const metricsData = await fetchDashboardMetrics();
      setMetrics(metricsData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error actualizando métricas:', err);
    }
  }, []);

  // Función para actualizar actividades
  const updateActivities = useCallback(async () => {
    try {
      const activitiesData = await fetchRecentActivities();
      setActivities(activitiesData);
    } catch (err) {
      console.error('Error actualizando actividades:', err);
    }
  }, []);

  // Función para actualizar estado de servidores
  const updateServerStatus = useCallback(async () => {
    try {
      const serverData = await fetchServerStatus();
      setServerStatus(serverData);
    } catch (err) {
      console.error('Error actualizando estado de servidores:', err);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Configurar actualizaciones automáticas
  useEffect(() => {
    const stopRealTimeUpdates = simulateRealTimeUpdate((newMetrics) => {
      setMetrics(newMetrics);
      setLastUpdate(new Date());
    }, 10000); // Actualizar cada 10 segundos

    return stopRealTimeUpdates;
  }, []);

  // Actualizar actividades cada 30 segundos
  useEffect(() => {
    const interval = setInterval(updateActivities, 30000);
    return () => clearInterval(interval);
  }, [updateActivities]);

  // Actualizar estado de servidores cada 15 segundos
  useEffect(() => {
    const interval = setInterval(updateServerStatus, 15000);
    return () => clearInterval(interval);
  }, [updateServerStatus]);

  return {
    metrics,
    serverStatus,
    activities,
    topProducts,
    loading,
    error,
    lastUpdate,
    refreshData: loadDashboardData,
    updateMetrics,
    updateActivities,
    updateServerStatus
  };
};

// Hook específico para simular crecimiento de usuarios
export const useUserGrowthSimulation = (initialUsers: number = 1000) => {
  const [users, setUsers] = useState(initialUsers);
  const [isGrowing, setIsGrowing] = useState(false);

  const startGrowth = useCallback(() => {
    if (isGrowing) return;
    
    setIsGrowing(true);
    const stopGrowth = simulateProgressiveUserGrowth(
      (newUsers) => setUsers(newUsers),
      users,
      10, // Incremento de 10 usuarios
      2000 // Cada 2 segundos
    );

    return stopGrowth;
  }, [users, isGrowing]);

  const stopGrowth = useCallback(() => {
    setIsGrowing(false);
  }, []);

  const resetUsers = useCallback(() => {
    setUsers(initialUsers);
    setIsGrowing(false);
  }, [initialUsers]);

  return {
    users,
    isGrowing,
    startGrowth,
    stopGrowth,
    resetUsers
  };
};

// Hook para métricas calculadas
export const useCalculatedMetrics = (metrics: DashboardMetrics | null) => {
  const [calculatedMetrics, setCalculatedMetrics] = useState({
    revenuePerUser: 0,
    orderConversionRate: 0,
    averageOrderValue: 0,
    userRetentionRate: 0
  });

  useEffect(() => {
    if (!metrics) return;

    // Calcular métricas derivadas
    const revenuePerUser = metrics.sales.monthly / metrics.users.total;
    const orderConversionRate = (metrics.orders.completed / metrics.users.active) * 100;
    const averageOrderValue = metrics.sales.monthly / metrics.orders.completed;
    const userRetentionRate = ((metrics.users.active - metrics.users.new) / metrics.users.total) * 100;

    setCalculatedMetrics({
      revenuePerUser: Math.round(revenuePerUser),
      orderConversionRate: Math.round(orderConversionRate * 10) / 10,
      averageOrderValue: Math.round(averageOrderValue),
      userRetentionRate: Math.round(userRetentionRate * 10) / 10
    });
  }, [metrics]);

  return calculatedMetrics;
};
