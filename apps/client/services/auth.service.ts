import HttpClient from "@/lib/api/httpClient";
import { LoginCredentials, RegisterCredentials } from "@/types/auth";

class AuthService {
  static basePath = "/api/v1/auth";

  public static async getRefreshToken() {
    const res = await HttpClient.get(`${this.basePath}/refresh-token`);
    return res.data;
  }

  public static async login(credentials: LoginCredentials) {
    const res = await HttpClient.post(`${this.basePath}/signin`, {
      email: credentials.email,
      password: credentials.password,
    });

    return res.data;
  }

  public static async register(credentials: RegisterCredentials) {
    const res = await HttpClient.post(`${this.basePath}/signup`, {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
    });

    return res.data;
  }

}

export default AuthService;
