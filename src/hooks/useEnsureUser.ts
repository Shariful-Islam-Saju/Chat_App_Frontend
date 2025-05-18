"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/lib/axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useEnsureUser = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const { data, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/auth/check-auth", {
        withCredentials: true,
      });
      return res.data.user;
    },
    enabled: !user, // Only run if no user
    retry: false, // Don't retry on failure
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser, router]);
  useEffect(() => {
    if (error) {
      console.error("Error in useEnsureUser:", error);

      router.push("/login");
    }
  }, [error, router]);

  return { data, isLoading };
};
