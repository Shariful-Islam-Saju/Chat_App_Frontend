import RegisterForm from "@/components/Register";
import type { Metadata } from "next";
import React from "react";

// Page metadata for SEO and social sharing
export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a new Chat App account to connect with friends in real-time.",
};

const page = () => {
  return <RegisterForm />;
};

export default page;
