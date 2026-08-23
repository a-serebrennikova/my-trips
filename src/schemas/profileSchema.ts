import z from "zod";
import { emailSchema, homeCitySchema, nameSchema } from "./authForms";

export const profileFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  homeCity: homeCitySchema,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
