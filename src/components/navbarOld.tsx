import { useState } from "react";
import LoginButton from "./ui/login-button";
import React from "react";
import { User } from "@supabase/supabase-js";
import { signout } from "@/actions/logout";
import Image from "next/image";

type NavbarProps = {
  user: User | null;
  setIsContactFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar: React.FC<NavbarProps> = ({ user, setIsContactFormOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await signout();
  };

  return (
    <nav className="lg:hidden">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <button onClick={toggleMenu}>
            <Image
              src="\img\Hamburger iconhamburger.svg"
              width={20}
              height={8}
              alt="Hamburger"
            />
          </button>
        </div>
        <div
          className={`absolute top-11  right-0 bg-header text-white transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-y-0" : "hidden"
          }`}
          style={{ zIndex: 1000 }}
        >
          <div className="flex flex-col items-center px-2 w-40">
            {!user && (
              <div
                className="flex items-center justify-between space-x-2 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <LoginButton
                  className="text-white hover:text-gray-300 py-2 border-none"
                  variant="link"
                />
                <Image
                  src="\img\login iconlogin.svg"
                  width={20}
                  height={8}
                  alt="login img"
                />
              </div>
            )}
            {user && (
              <div
                className="text-white hover:text-gray-300 py-2 cursor-pointer flex items-center justify-between "
                onClick={() => {
                  setIsContactFormOpen(true);
                  setIsOpen(false);
                }}
              >
                Contact
                <Image
                  src="\img\Contact iconcontact.svg"
                  width={20}
                  height={8}
                  alt="contact img"
                  className="px-3"
                />
              </div>
            )}

            {user && (
              <div
                className="text-white hover:text-gray-300 py-2 cursor-pointer"
                onClick={handleLogout}
              >
                Log out
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
