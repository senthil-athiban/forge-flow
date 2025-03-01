import HttpClient from "@/lib/api/httpClient"

class UserService {
    static basePath = '/api/v1/user'

    public static async getProfile(): Promise<any> {
        const res = await HttpClient.get(`${this.basePath}/me`);
        return res.data;
    }

    public static async verifyOAuth(): Promise<any> {
        const res = await HttpClient.get(`${this.basePath}/oauth/verify`);
        return res.data;
    }
}

export default UserService;