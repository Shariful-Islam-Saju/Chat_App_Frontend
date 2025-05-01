"use server";
import * as z from "zod";
import { loginFormSchema, registerFormSchema } from "../model/authSchemas";
import { cookies } from "next/headers";

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
      credentials: "include",
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
    await setCookieInClient(res);
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

async function setCookieInClient(response: Response) {
  // Extract the Set-Cookie header from the response
  const setCookieHeader = response.headers.get("set-cookie");

  if (setCookieHeader) {
    // Split the cookie header into parts (name=value and attributes)
    const cookieParts = setCookieHeader.split(";").map((part) => part.trim());

    // Extract name and value from the first part
    const [cookieName, cookieValue] = cookieParts[0]
      .split("=")
      .map((part) => part.trim());

    // Parse cookie attributes
    const attributes: Record<string, string | boolean | number> = {};
    for (let i = 1; i < cookieParts.length; i++) {
      const [key, value] = cookieParts[i].split("=").map((part) => part.trim());
      if (key) {
        attributes[key.toLowerCase()] = value !== undefined ? value : true;
      }
    }

    console.log(cookieName, " and", cookieValue);
    // Await cookies() to get the Cookies object
    const cookieStore = await cookies();

    // Set the cookie in the client's browser using Next.js cookies API
    cookieStore.set({
      name: cookieName,
      value: cookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }
}
