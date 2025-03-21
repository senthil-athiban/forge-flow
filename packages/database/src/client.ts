import { PrismaClient } from "@prisma/client";
import { withPulse } from "@prisma/extension-pulse";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(
    withPulse({
      apiKey: process.env["PULSE_API_KEY"] as string,
    })
  );
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
