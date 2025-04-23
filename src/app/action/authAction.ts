"use server";
import * as z from "zod";
import { loginFormSchema, registerFormSchema } from "../model/authSchemas";

export const registerAction = async (
  user: z.infer<typeof registerFormSchema>
) => {
  try {
    // Validate user input fields
    const validateFields = registerFormSchema.safeParse(user);
    if (validateFields.error) throw new Error("Invalid Fields");

    // Prepare FormData for the request
    const formData = new FormData();
    formData.append("name", validateFields.data.name);
    formData.append("email", validateFields.data.email);
    formData.append("password", validateFields.data.password);

    // Append avatar if it exists
    if (validateFields.data.avatar && validateFields.data.avatar[0]) {
      formData.append("avatar", validateFields.data.avatar[0]);
    }

    // Send request to the server
    const res = await fetch(`${process.env.SERVER_URL}/api/auth/register`, {
      method: "POST",
      body: formData,
    });

    // Handle server response
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to register: ${err}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    // Handle errors
    if (error instanceof Error) {
      throw new Error(`registerAction error: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred in registerAction.");
    }
  }
};

export const loginAction = async (user: z.infer<typeof loginFormSchema>) => {
  try {
    // Validate user input fields
    const validateFields = loginFormSchema.safeParse(user);
    if (validateFields.error) throw new Error("Invalid Fields");

    // Prepare form data for the request
    const formData = new FormData();
    formData.append("email", validateFields.data.email);
    formData.append("password", validateFields.data.password);

    // Send request to the server
    const res = await fetch(`${process.env.SERVER_URL}/api/auth/login`, {
      method: "POST",
      body: formData,
    });

    // Handle server response
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to log in: ${err}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    // Handle errors
    if (error instanceof Error) {
      throw new Error(`loginAction error: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred in loginAction.");
    }
  }
};