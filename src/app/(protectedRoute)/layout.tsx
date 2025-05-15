"use client"
import { useEnsureUser } from "@/hooks/useEnsureUser";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  useEnsureUser();
  return <>{children}</>;
};

export default layout;
