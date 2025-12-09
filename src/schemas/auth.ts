import z from "zod";

export const registerSchema = z.object({
    email: z.email(),
    name: z.string().min(4, "El nombre debe contener al menos 4 caracteres")
});

export type RegisterForm = z.infer<typeof registerSchema>;

export const resetPasswordSchema = z.object({
    password : z.string().min(8, "Minimo debe contener 8 caracteres"),
    password_confirmed : z.string().min(8, "Minimo debe contener 8 caracteres"),
    tkn : z.string().or(z.number())
}).refine((data) => data.password === data.password_confirmed, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmed"], // el error cae en este campo
  })

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>