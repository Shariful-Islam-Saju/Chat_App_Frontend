import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email: string;
  profilePic: string
};

type AuthStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
