"use client";

import { useEnsureUser } from "@/hooks/useEnsureUser";
import React, { ReactNode, useEffect } from "react";
import Loading from "./loding";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useEnsureUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (isLoading && !user) {
    return <Loading />;
  }

  return <>{children}</>; 
};

export default Layout;
