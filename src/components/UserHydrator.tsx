// components/UserHydrator.tsx
"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    profilePic: string;
  };
};

export default function UserHydrator({ user }: Props) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null; // this component just sets the store
}
