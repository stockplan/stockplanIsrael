"use client";

import { Button } from "./button";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import AuthModal from "../auth/auth-modal";

interface LoginButtonProps {
  variant?: any;
  className?: string;
  children?: React.ReactNode;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  variant = "ghost",
  className = "border border-white text-white",
  children = "Log in",
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <AuthModal />
      </DialogContent>
    </Dialog>
  );
};

export default LoginButton;
