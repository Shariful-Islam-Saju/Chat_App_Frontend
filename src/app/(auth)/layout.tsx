import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import axios from "axios";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get("jwt_auth_token")?.value;

  if (!jwtToken) {
    // No token means not logged in
    return <>{children}</>;
  }

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/check-auth`,
      {
        headers: {
          Cookie: `jwt_auth_token=${jwtToken}`, // ✅ Pass token as cookie
        },
      }
    );

    const user = res.data.user;
    console.log(user);
    if (user?.id) {
      // User is already logged in, redirect them
      console.log("Hi");
      redirect("/dashboard");
    }

    // Token exists but user isn't valid
    return <>{children}</>;
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // re-throw Next.js redirect
    }
    console.error("Auth check failed", error);
    return <>{children}</>;
  }
}
