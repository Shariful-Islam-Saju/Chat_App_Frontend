import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import axios from "axios";
import UserHydrator from "@/components/UserHydrator";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get("jwt_auth_token")?.value;

  if (!jwtToken) {
    redirect("/login"); // no token, redirect immediately
  }

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/check-auth`,
      {
        headers: {
          Cookie: `jwt_auth_token=${jwtToken}`, // pass cookie header manually
        },
      }
    );

    const user = res.data.user;

    if (!user?.id) {
      redirect("/login"); // token invalid or user not found
    }

    return (
      <>
        <UserHydrator user={user} />
        {children}
      </>
    );
  } catch (error) {
    // Only handle non-redirect errors here
    // If the error is redirect error, re-throw it to let Next.js handle it
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // re-throw Next.js redirect
    }
    console.error("Auth check failed", error);
    redirect("/login"); // on error redirect to login
  }
}
