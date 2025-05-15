"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/lib/axios";

export const useEnsureUser = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance("/api/auth/check-auth", {
          method: "GET",
          withCredentials: true,
        });
        console.log(res.data)
        setUser(res.data.user);
      } catch (error) {
        window.location.href = "/login";
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser]);
};
