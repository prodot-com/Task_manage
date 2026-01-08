import { z } from "zod";

export const loginSchema = z.object({
  userName: z.string().min(2, "Name required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  userName: z.string().min(2, "Name required"),
  password: z.string().min(6),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
