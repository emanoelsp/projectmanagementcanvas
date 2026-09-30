import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const registerStep1Schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

export const teamMemberSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome inválido"),
});

export const registerStep2Schema = z.object({
  teamName: z.string().min(2, "Nome da equipe inválido"),
  members: z.array(teamMemberSchema).min(0).max(20),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterStep1Input = z.infer<typeof registerStep1Schema>;
export type RegisterStep2Input = z.infer<typeof registerStep2Schema>;
