import { ApiError } from "../config/error";
import { SignInSchema, SignIntype } from "../schema";
import userService from "./user.service";
import bcryptjs from "bcryptjs";

const loginUsingEmailPassword = async (body: SignIntype) => {
  const parsedData = SignInSchema.safeParse(body);
  if (!parsedData.success) return { message: "Invalid Inputs" };
  const { email, password } = parsedData.data;

  // todo refactor this
  const user = await userService.getUser({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      emailVerified: true,
    },
  });
  if (!user) {
    throw new ApiError(404, "No Account Exists");
  }
  const confirmPassword = await bcryptjs.compare(password, user?.password);
  if (!confirmPassword) throw new ApiError(401, "Invalid credentials");
  if (!user.emailVerified) throw new ApiError(401, "Email not verified");
  return user;
};

export default {loginUsingEmailPassword}
