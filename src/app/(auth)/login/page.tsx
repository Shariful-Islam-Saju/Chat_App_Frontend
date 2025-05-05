import LoginForm from "@/components/Login";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Login to access your Chat App account and connect with friends in real-time.",
};
const page = () => {
  return <LoginForm />;
};

export default page;
