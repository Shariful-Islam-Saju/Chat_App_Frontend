"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/lib/axios";
import { useEffect } from "react";

export const useEnsureUser = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { data, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/auth/check-auth", {
        withCredentials: true,
      });
      return res.data.user;
    },
    enabled: !user, // Only fetch if no user exists
    retry: false, // Disable retries to handle redirect immediately
  });

  // Handle successful data fetch
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.log("Error in useEnsureUser", error);
      window.location.href = "/login";
    }
  }, [error]);

  return { user, isLoading };
};
