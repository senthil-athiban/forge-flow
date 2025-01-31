import BaseIntegrationService from "./base.service";

class SlackService extends BaseIntegrationService {
    protected static basePath = '/api/v1/slack';
}

export default SlackService;