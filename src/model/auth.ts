import * as z from "zod";

export const LoginSchemas = z.object({
  email: z.string().email("Type a valid email"),
  password: z.string().min(1, "Password needed"),
});


export const RegisterSchemas = z.object({
  name: z.string().min(2, "Minimum 2 characters needed"),
  email: z.string().email("Type a valid email"),
  password: z.string().min(6, "Minimum 6 characters needed"),
  profilePic: z.instanceof(File).optional(),
});
