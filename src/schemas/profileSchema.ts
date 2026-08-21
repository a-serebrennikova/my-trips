import z from "zod";
import { MAX_AVATAR_SIZE_BYTES, MAX_AVATAR_SIZE_MB } from "@/src/consts/images";
import { emailSchema, nameSchema } from "./authForms";

export const profileFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  avatar: z
    .custom<File | null | undefined>(
      (value) => {
        return value === null || value === undefined || value instanceof File;
      },
      {
        message: "Avatar should be an image file",
      },
    )
    .refine(
      (value) => {
        return (
          value === null ||
          value === undefined ||
          value.size <= MAX_AVATAR_SIZE_BYTES
        );
      },
      {
        message: `Image is too large. Maximum size is ${MAX_AVATAR_SIZE_MB} MB.`,
      },
    ),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
