import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  // FIXME use actual method for email
  .email("Enter a valid email address");
export const nameSchema = z.string().trim().min(1, "Name is required");
export const homeCitySchema = z.string().trim().min(1, "Home city is required");

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    name: nameSchema,
    homeCity: homeCitySchema,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
