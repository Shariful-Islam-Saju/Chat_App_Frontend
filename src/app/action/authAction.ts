"use server";
import * as z from "zod";
import { registerFormSchema } from "../model/authSchemas";

export const registerAction = async (
  user: z.infer<typeof registerFormSchema>
) => {
  try {
    const validateFields = registerFormSchema.safeParse(user);
    if (validateFields.error) throw new Error("Invalid Fields");

    const formData = new FormData();
    formData.append("name", validateFields.data.name);
    formData.append("email", validateFields.data.email);
    formData.append("password", validateFields.data.password);

    if (validateFields.data.avatar && validateFields.data.avatar[0]) {
      formData.append("avatar", validateFields.data.avatar[0]);
    }

    const res = await fetch(`${process.env.SERVER_URL}/api/auth/register`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to register: ${err}`);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`registerAction error: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred in registerAction.");
    }
  }
};
