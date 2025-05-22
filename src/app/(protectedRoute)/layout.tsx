import axiosInstance from "@/lib/axios";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  try {
    const res = await axiosInstance("/api/auth/check-auth", {
      withCredentials: true,
    });
    const user = res.data;

    if (!user?.id) {
      redirect("/login"); // Or wherever your login route is
    }

    return <>{children}</>;
  } catch (error) {
    console.error("Auth check failed", error);
    redirect("/login");
  }
}
