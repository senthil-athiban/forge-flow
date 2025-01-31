import HttpClient from "@/lib/api/httpClient";
import BaseIntegrationService from "./base.service";

class DiscordService extends BaseIntegrationService {
    protected static basePath = '/api/v1/discord';
}

export default DiscordService;