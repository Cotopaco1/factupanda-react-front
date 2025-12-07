import z from "zod";

export const loginSchema = z.object({
    email : z.email(),
    password : z.string().min(8, "Minimo de 8 caracteres")
});
export type LoginForm = z.infer<typeof loginSchema>