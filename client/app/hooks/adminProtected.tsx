import { redirect } from "next/navigation";
import userAuth from "./userAuth";
import { ReactNode } from "react";
import { useSelector } from "react-redux";

interface Props {
  children: ReactNode;
}

export default function AdminProtected({ children }: Props) {
  const { user } = useSelector((state: any) => state.auth);
  if (user) {
    const isAdmin = user?.role === "admin";
    return isAdmin ? children : redirect("/");
  }
}
