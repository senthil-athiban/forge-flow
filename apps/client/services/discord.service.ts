import HttpClient from "@/lib/api/httpClient";

class DiscordService {
    static basePath = '/api/v1/discord';

    public static async addDiscord() {
        const res = await HttpClient.get(`${this.basePath}/add`);
        return res.data;
    }
}

export default DiscordService;