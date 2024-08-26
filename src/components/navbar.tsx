import { useState } from "react";
import LoginButton from "./ui/login-button";
import React from "react";
import { User } from "@supabase/supabase-js";
import { signout } from "@/actions/logout";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

type NavbarProps = {
  user: User | null;
  setIsContactFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar: React.FC<NavbarProps> = ({ user, setIsContactFormOpen }) => {
  const handleLogout = async () => {
    await signout();
  };

  return (
    <nav className="lg:hidden">
      <div className="container mx-auto flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-header hover:bg-hoverHeader">
              <Image
                src="/img/Hamburger iconhamburger.svg"
                width={20}
                height={8}
                alt="Hamburger"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="bg-header text-white w-40"
          >
            {!user && (
              <DropdownMenuItem asChild>
                <LoginButton className="text-white py-2 border-none cursor-pointer w-full flex justify-evenly bg-header hover:bg-hoverHeader">
                  Log in
                  <Image
                    src="/img/login iconlogin.svg"
                    width={20}
                    height={8}
                    alt="login img"
                  />
                </LoginButton>
              </DropdownMenuItem>
            )}

            {user && (
              <>
                <DropdownMenuItem asChild>
                  <div
                    className="text-white  bg-header hover:bg-hoverHeader py-2 cursor-pointer flex items-center justify-between"
                    onClick={() => {
                      setIsContactFormOpen(true);
                    }}
                  >
                    Contact
                    <Image
                      src="/img/Contact iconcontact.svg"
                      width={20}
                      height={8}
                      alt="contact img"
                      className="px-3"
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <div
                    className="text-white  bg-header hover:bg-hoverHeader py-2 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Log out
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
