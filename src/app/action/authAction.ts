"use server";
import * as z from "zod";
import { loginFormSchema, registerFormSchema } from "../model/authSchemas";

export const registerAction = async (
  user: z.infer<typeof registerFormSchema>
) => {
  try {
    // Validate user input fields
    const validateFields = registerFormSchema.safeParse(user);
    if (!validateFields.success) {
      return { success: false, message: "Invalid Fields" };
    }

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
      return { success: false, message: `Failed to register: ${err}` };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `registerAction error: ${error.message}`,
      };
    }
    return {
      success: false,
      message: "Unknown error occurred in registerAction.",
    };
  }
};

export const loginAction = async (user: z.infer<typeof loginFormSchema>) => {
  try {
    // Validate user input fields
    const validateFields = loginFormSchema.safeParse(user);
    if (!validateFields.success) {
      return { success: false, message: "Invalid Fields" };
    }

    // Send request to the server
    const res = await fetch(`${process.env.SERVER_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: validateFields.data.email,
        password: validateFields.data.password,
      }),
      credentials: "include",
    });

    // Handle server response
    if (!res.ok) {
      const err = await res.text();
      return { success: false, message: `Failed to log in: ${err}` };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: `loginAction error: ${error.message}` };
    }
    return {
      success: false,
      message: "Unknown error occurred in loginAction.",
    };
  }
};
