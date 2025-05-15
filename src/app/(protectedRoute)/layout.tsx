"use client"
import { useEnsureUser } from "@/hooks/useEnsureUser";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  useEnsureUser();
  return <>{children}</>;
};

export default Layout;
