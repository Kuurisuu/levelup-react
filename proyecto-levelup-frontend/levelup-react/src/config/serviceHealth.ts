import { MICROSERVICE_URLS } from './axios';

class ServiceHealthMonitor {
    private serviceStatus: Map<string, boolean> = new Map();
    private checkInterval: number = 30000; // 30 seconds

    startMonitoring() {
        Object.entries(MICROSERVICE_URLS).forEach(([service, url]) => {
            this.checkHealth(service, url);
            setInterval(() => this.checkHealth(service, url), this.checkInterval);
        });
    }

    private async checkHealth(service: string, url: string) {
        try {
            await fetch(`${url}/health`);
            this.serviceStatus.set(service, true);
        } catch {
            this.serviceStatus.set(service, false);
            console.warn(`Service ${service} is down`);
        }
    }

    isServiceHealthy(service: string): boolean {
        return this.serviceStatus.get(service) ?? false;
    }
}

export const healthMonitor = new ServiceHealthMonitor();
