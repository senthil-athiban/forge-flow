import HttpClient from "@/lib/api/httpClient";
import { ZapPayload } from "@/types/zap";

class ZapService {
    static basePath = '/api/v1/zap';

    public static async getZapByUserId() {
        const res = await HttpClient.get(`${this.basePath}`);
        return res.data;
    }

    public static async createZap(payload: ZapPayload) {
        const res = await HttpClient.post(`${this.basePath}/create`, payload);
        return res.data;
    }

    public static async getZapTriggers() {
        const res = await HttpClient.get(`/api/v1/trigger`);
        return res.data;
    }

    public static async getZapActions() {
        const res = await HttpClient.get(`/api/v1/action`);
        return res.data;
    }
}

export default ZapService;