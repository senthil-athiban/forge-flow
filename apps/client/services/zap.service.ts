import HttpClient from "@/lib/api/httpClient";

class ZapService {
    static basePath = '/api/v1/zap';

    public static async getZapByUserId() {
        const res = await HttpClient.get(`${this.basePath}`);
        return res.data;
    }
}

export default ZapService;