import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get("jwt_auth_token");
  if (jwtToken) {
    redirect("/dashboard");
  }
  return <>{children}</>;
};

export default layout;
