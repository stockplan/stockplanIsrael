import LoginButton from "./ui/login-button"
import React from "react"
import { User } from "@supabase/supabase-js"
import { signout } from "@/actions/logout"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { IoIosMenu } from "react-icons/io"
import { FaUser } from "react-icons/fa"

type NavbarProps = {
  user: User | null
  setIsContactFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar: React.FC<NavbarProps> = ({ user, setIsContactFormOpen }) => {
  const handleLogout = async () => {
    await signout()
  }

  return (
    <nav className="lg:hidden">
      <div className=" mx-auto flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-header hover:bg-hoverHeader">
              <IoIosMenu className=" w-8 h-8" />
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
                  <span>Log in</span>
                  <FaUser className="h-7 w-7" />
                </LoginButton>
              </DropdownMenuItem>
            )}

            {user && (
              <>
                <DropdownMenuItem asChild>
                  <div
                    className="text-white  bg-header hover:bg-hoverHeader py-2 cursor-pointer flex items-center justify-between"
                    onClick={() => {
                      setIsContactFormOpen(true)
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
  )
}

export default Navbar
