import HttpClient from "@/lib/api/httpClient";

abstract class BaseIntegrationService {
    protected static basePath: string;

    public static async add() {
        const res = await HttpClient.get(`${this.basePath}/add`);
        return res.data;
    }

    public static async getChannels() {
        const res = await HttpClient.get(`${this.basePath}/channels`);
        return res.data;
    }
}

export default BaseIntegrationService;