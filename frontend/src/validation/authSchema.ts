import { z } from "zod";

export const loginSchema = z.object({
  userName: z.string().min(3, "Username required and must be atleast 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  userName: z.string().min(3, "Username required and must be atleast 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
