import axiosInstance from "@/lib/axios";
import { create } from "zustand";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  // Add more fields if your backend returns them
}

interface AuthState {
  authUser: AuthUser | null;
  isAuthUserLoading: boolean;
  checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isAuthUserLoading: true,
  checkUser: async () => {
    set({ isAuthUserLoading: true });
    try {
      const res = await axiosInstance.get("/api/auth/check-auth");
      set({ authUser: res.data });
    } catch (error) {
      console.error("❌ Error in useAuthStore:", error);
      set({ authUser: null });
    } finally {
      set({ isAuthUserLoading: false });
    }
  },
}));
