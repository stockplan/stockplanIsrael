import React, { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { MdContactSupport, MdLogin, MdLogout } from "react-icons/md"
import { IoIosMenu } from "react-icons/io"
import Image from "next/image"
import { User } from "@supabase/supabase-js"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer"
import ContactForm from "./forms/contact-form"
import LoginForm from "./forms/login-form"
import { signout } from "@/actions/logout"

interface HeaderNavMobileProps {
  user: User
}

enum ModalsEnum {
  EMPTY,
  CONTACT,
  AUTH,
}
const HeaderNavMobile: React.FC<HeaderNavMobileProps> = ({ user }) => {
  const [modal, setModal] = useState(ModalsEnum.EMPTY)
  const [isOpen, setIsOpen] = useState(false)

  const contentWithUser = () => {
    return (
      <>
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>Profile</DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              setIsOpen(true)
              setModal(ModalsEnum.CONTACT)
            }}
          >
            Contact
            <DropdownMenuShortcut>
              <MdContactSupport className="h-5 w-5" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signout()}>
          Log out
          <DropdownMenuShortcut>
            <MdLogout className="h-5 w-5" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </>
    )
  }

  const contentWithoutUser = () => {
    return (
      <>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(e) => {
              setIsOpen(true)
              setModal(ModalsEnum.AUTH)
            }}
          >
            Login
            <DropdownMenuShortcut>
              <MdLogin className="h-5 w-5" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </>
    )
  }

  const dropdownContent = user ? contentWithUser() : contentWithoutUser()

  const formContent =
    modal === ModalsEnum.CONTACT ? (
      <div>
        <DrawerHeader>
          <DrawerTitle className="text-center text-lg sm:text-xl text-gray-700">
            Contact us
          </DrawerTitle>
          <DrawerDescription className="text-center text-sm sm:text-base mt-2 text-gray-700">
            For any matter, please feel free to contact us.
          </DrawerDescription>
        </DrawerHeader>
        <ContactForm onSubmitSuccess={() => setIsOpen(false)} />
      </div>
    ) : (
      <div>
        <DrawerHeader>
          <div className="relative h-20 bg-[#2D5686] flex items-center justify-center rounded-lg my-4 p-8 shadow-md">
            <Image src="/img/Logo.png" alt="logo" height={40} width={200} />
          </div>
          <DrawerTitle className="mb-8 text-3xl text-center text-cyan-900 dark:text-white font-bold">
            Log in to unlock the <br /> best of Stocksplan.com
          </DrawerTitle>
          <DrawerDescription className="text-center text-sm sm:text-base mt-2 text-gray-700"></DrawerDescription>
        </DrawerHeader>
        <LoginForm showContent={false} />
      </div>
    )

  return (
    <Drawer open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="bg-inherit text-white border-none flex-shrink-0 block md:hidden">
            <IoIosMenu className="w-8 h-8" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Stocksplan.com</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dropdownContent}
        </DropdownMenuContent>
      </DropdownMenu>

      <DrawerContent>{formContent}</DrawerContent>
    </Drawer>
  )
}

export default HeaderNavMobile
