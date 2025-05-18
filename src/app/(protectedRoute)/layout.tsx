"use client";

import React, { ReactNode } from "react";
import Loading from "./loading";
import { useEnsureUser } from "@/hooks/useEnsureUser";

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading } = useEnsureUser();
  if (isLoading || !user) {
    return <Loading />; // Or a Spinner component
  }

  return <>{children}</>;
};

export default Layout;
