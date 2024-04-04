import { redirect } from "next/navigation";
import userAuth from "./userAuth";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Protected({ children }: Props) {
  const isAuthenticated = userAuth();
  return isAuthenticated ? children : redirect("/");
}
