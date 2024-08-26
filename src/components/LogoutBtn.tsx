"use client";

import { signout } from "@/actions/logout";
import { Button } from "./ui/button";

interface LogoutBtnProps {
  className?: string;
  variant?: any;
}

const LogoutBtn: React.FC<LogoutBtnProps> = ({
  className = "border border-white text-white",
  variant = "ghost",
}) => {
  const handleLogout = async () => {
    await signout();
  };

  return (
    <Button variant={variant} className={className} onClick={handleLogout}>
      Log out
    </Button>
  );
};

export default LogoutBtn;
