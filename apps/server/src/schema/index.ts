import { z } from "zod";

export const SignUpSchema = z.object({
    name: z.string().min(2),
    email: z.string().min(5),
    password: z.string().min(4)
});

export const SignInSchema = z.object({
    email: z.string(),
    password: z.string()
});

export const zapSchema = z.object({
    triggerTypeId: z.string(),
    actions: z.array(z.object({
        actionTypeId: z.string(),
        actionMetaData: z.any()
    }))
});

export const forgotPasswordSchema = z.object({
    email: z.string()
})

export type SignIntype = z.infer<typeof SignInSchema>