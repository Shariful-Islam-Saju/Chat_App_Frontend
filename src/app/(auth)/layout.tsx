import axiosInstance from "@/lib/axios";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    const res = await axiosInstance("/api/auth/check-auth", {
      withCredentials: true,
    });

    const user = res.data;

    if (user?.id) {
      // User is logged in, redirect to dashboard
      redirect("/dashboard");
    }

    // User is not logged in, show auth pages
    return <>{children}</>;
  } catch (error) {
    // If check-auth fails, assume user is not authenticated
    return <>{children}</>;
  }
}
