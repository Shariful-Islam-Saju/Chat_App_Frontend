"use client";

import { useEnsureUser } from "@/hooks/useEnsureUser";
import React, { ReactNode } from "react";
import Loading from "./loading";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useEnsureUser();

  if (isLoading || !user) {
    return <Loading />; // Or a Spinner component
  }

  return <>{children}</>;
};

export default Layout;
