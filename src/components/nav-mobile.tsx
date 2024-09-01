"use client"

import { useState } from "react"
import React from "react"
import { User } from "@supabase/supabase-js"
import { signout } from "@/actions/logout"
import Image from "next/image"
import Link from "next/link"
import { FaMailchimp, FaUser } from "react-icons/fa"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuGroup,
} from "./ui/dropdown-menu"
import { IoIosMenu } from "react-icons/io"

import { VscArrowRight, VscSignOut } from "react-icons/vsc"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

import GoogleSignin from "./GoogleSignin"

type NavMobileProps = {
  user: User | null
}

const ContactFormModal = dynamic(() => import("./ContactForm"), { ssr: false })

const NavMobile: React.FC<NavMobileProps> = ({ user }) => {
  const [val, setVal] = useState("")
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const router = useRouter()

  const goToDemo = (e: any) => {
    e.preventDefault()

    if (!val) return

    router.push(`/calculator/lossprofit?ticker=${val}`)
    setVal("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (/^[A-Z]*$/.test(value)) {
      setVal(value)
    }
  }

  const handleLogout = async () => {
    await signout()
  }

  const openAuthModal = () => {
    setIsAuthModalOpen(true)
  }

  return (
    <div className="flex items-center justify-between flex-row-reverse">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="bg-inherit text-white border-none">
            <IoIosMenu className="w-8 h-8" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Plan Your Trade</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuGroup>
            {!user ? (
              <DropdownMenuItem
                onClick={openAuthModal}
                className="cursor-pointer"
              >
                <span>Log in</span>
                <DropdownMenuShortcut>
                  <FaUser className="h-5 w-5" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsContactFormOpen(true)}
                >
                  <span>Contact</span>
                  <DropdownMenuShortcut>
                    <FaMailchimp className="h-5 w-5" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <span>Logout</span>
                  <DropdownMenuShortcut>
                    <VscSignOut className="h-5 w-5" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <form
        className="flex items-center bg-white py-1 px-2 lg:mt-0 rounded-full lg:mr-4 lg:w-auto"
        onSubmit={goToDemo}
      >
        <input
          type="text"
          value={val}
          disabled={!!user}
          onChange={handleChange}
          className="w-full bg-transparent border-none focus:outline-none pl-2"
          placeholder="AAPL"
        />
        <button
          className={`bg-transparent pr-2 ${cn(
            !user ? "cursor-pointer" : "cursor-default"
          )}`}
        >
          {val && <VscArrowRight />}
        </button>
      </form>

      <div className="flex items-center">
        <Image
          src="/img/Logo.png"
          alt="logo"
          width={166}
          height={37}
          className="saturate-200 object-contain w-32 md:w-40 lg:w-48 h-auto"
          priority
        />
      </div>
      <ContactFormModal
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />

      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="relative h-20 bg-[#2D5686] text-cyan-900 flex items-center justify-center rounded-lg my-4 p-8 shadow-md">
              <Image
                src="/img/Logo.png"
                alt="logo"
                height={40}
                width={200}
                className="h-auto w-auto"
              />
            </div>
            <DialogTitle className="mb-8 text-3xl text-center text-cyan-900 dark:text-white font-bold">
              Log in to unlock the <br /> best of Stocksplan.com
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="mt-10 grid space-y-4 px-8">
            <GoogleSignin />
          </DialogDescription>
          <DialogFooter className="mt-14 space-y-4 py-3 text-gray-600 dark:text-gray-400 text-center">
            <div className="text-xs">
              By proceeding, you agree to our{" "}
              <Link
                href="/terms"
                className="underline text-blue-600 dark:text-blue-400"
              >
                Terms of Use
              </Link>{" "}
              and confirm you have read our{" "}
              <Link
                href="/privacy"
                className="underline text-blue-600 dark:text-blue-400"
              >
                Privacy and Cookie Statement
              </Link>
              .
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NavMobile
