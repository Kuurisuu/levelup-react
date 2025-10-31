export class ServiceRegistry {
    private static healthCache = new Map<string, boolean>();
    private static lastCheck = new Map<string, number>();
    private static readonly CHECK_INTERVAL = 30000; // 30 seconds

    static async checkServiceHealth(service: string, url: string): Promise<boolean> {
        // Bypass salud en desarrollo para evitar CORS y no bloquear UI
        if ((import.meta as any).env?.VITE_BYPASS_HEALTH === 'true') {
            return true;
        }
        const now = Date.now();
        const lastCheck = this.lastCheck.get(service) || 0;

        if (now - lastCheck < this.CHECK_INTERVAL) {
            return this.healthCache.get(service) || false;
        }

        try {
            const response = await fetch(`${url}/health`, { method: 'GET' });
            const isHealthy = response.ok;
            this.healthCache.set(service, isHealthy);
            this.lastCheck.set(service, now);
            return isHealthy;
        } catch {
            this.healthCache.set(service, false);
            this.lastCheck.set(service, now);
            return false;
        }
    }

    static getFallbackService(service: string): string {
        const gateway = (import.meta as any).env?.VITE_GATEWAY_URL || 'http://localhost:8080/api/v1';
        return gateway;
    }
}
