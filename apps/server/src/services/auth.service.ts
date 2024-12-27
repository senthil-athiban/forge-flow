import { ApiError } from "../config/error";
import { SignInSchema, SignIntype } from "../schema";
import tokenService from "./token.service";
import userService from "./user.service";
import bcryptjs from "bcryptjs";
import { prismaClient } from "../db/index";
import { TokenTypes } from "../config/tokenTypes";

const loginUsingEmailPassword = async (body: SignIntype) => {
  const parsedData = SignInSchema.safeParse(body);
  if (!parsedData.success) throw new ApiError(401, "Invalid credentials");
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
  const confirmPassword = await bcryptjs.compare(password, user?.password!);
  if (!confirmPassword) throw new ApiError(401, "Invalid credentials");
  if (!user.emailVerified) throw new ApiError(401, "Email not verified");
  return user;
};

const resetPassword = async (token: string, newPassword: string) => {
  try {
    const verifiedToken = await tokenService.verifyToken(
      token,
      TokenTypes.RESET
    );
    const user = await userService.getUser({
      where: { id: verifiedToken.userId },
      select: { id: true, email: true },
    });
    if (!user) throw new ApiError(404, "User not exists");
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await userService.updateUserById(user.id, { password: hashedPassword });
    await prismaClient.token.deleteMany({
      where: {
        userId: user.id,
        type: TokenTypes.RESET,
      },
    });
  } catch (error) {
    throw new ApiError(401, "Un-authorized");
  }
};

export default { loginUsingEmailPassword, resetPassword };
