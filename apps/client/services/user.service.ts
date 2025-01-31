import HttpClient from "@/lib/api/httpClient"

class UserService {
    static basePath = '/api/v1/user'

    public static async verifyUser(): Promise<any> {
        const res = await HttpClient.get(`${this.basePath}/verify`);
        return res.data;
    }
}

export default UserService;