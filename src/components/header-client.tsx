// HeaderClient.tsx
"use client"

import React, { useState } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { IoIosMenu } from "react-icons/io"
import { FaMailchimp, FaUser } from "react-icons/fa"
import { VscArrowRight, VscSignOut } from "react-icons/vsc"
import { signout } from "@/actions/logout"
import { cn } from "@/lib/utils"
import LogoutBtn from "./LogoutBtn"
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

// import AuthModal from "./auth/auth-modal"
import { Button } from "./ui/button"
import { MdContactSupport } from "react-icons/md"

const ContactFormModal = dynamic(() => import("./ContactForm"), { ssr: false })
const AuthModal = dynamic(() => import("./auth/auth-modal"), { ssr: false })

interface HeaderClientProps {
  user: User | null
}

const HeaderClient: React.FC<HeaderClientProps> = ({ user }) => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const router = useRouter()

  const handleLogout = async () => {
    await signout()
  }

  const handleAuthModalOpen = () => {
    setIsAuthModalOpen(true)
  }

  return (
    <header className={cn(`bg-header shadow-lg py-2`)}>
      <div className="flex items-center justify-between mx-5">
        <div className="cursor-pointer" onClick={() => router.push("/home")}>
          <Image
            src="/images/logo-sm.png"
            priority
            alt="logo"
            width={125}
            height={37}
            className="h-auto w-auto shrink-0"
          />
        </div>

        {!user && (
          <form
            className="hidden md:flex items-center w-1/3 bg-white py-1 px-2 lg:mt-0 rounded-sm mr-4 self-stretch"
            onSubmit={(e) => {
              e.preventDefault()
              if (inputValue) {
                router.push(
                  `/calculator/lossprofit?ticker=${inputValue.toUpperCase()}`
                )
                setInputValue("")
              }
            }}
          >
            <input
              name="ticker"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full text-sm bg-transparent border-none focus:outline-none pl-2"
              placeholder="Enter a symbol (for example: AAPL)"
            />
            {inputValue && (
              <button
                type="submit"
                className="bg-transparent pr-2 cursor-pointer"
              >
                <VscArrowRight />
              </button>
            )}
          </form>
        )}

        <div className="hidden md:flex items-center">
          {user ? (
            <>
              <Button
                variant="ghost"
                className="border border-white text-white mr-4 px-4 py-2 rounded"
                onClick={() => setIsContactFormOpen(true)}
              >
                Contact
              </Button>
              <LogoutBtn />
            </>
          ) : (
            <Button
              variant={"ghost"}
              className="border border-white text-white mr-4 px-4 py-2 rounded"
              onClick={handleAuthModalOpen}
            >
              Log in
            </Button>
          )}
        </div>

        <div className={cn("md:hidden flex space-x-2", user ?? "w-full")}>
          {!user && (
            <form
              className="flex flex-1 bg-white px-2 rounded-full mx-2 "
              onSubmit={(e) => {
                e.preventDefault()
                if (inputValue) {
                  router.push(
                    `/calculator/lossprofit?ticker=${inputValue.toUpperCase()}`
                  )
                  setInputValue("")
                }
              }}
            >
              <input
                name="ticker"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full text-xs bg-transparent border-none focus:outline-none pl-2"
                placeholder="Enter a symbol (for example: AAPL)"
              />
              {inputValue && (
                <button
                  type="submit"
                  className="bg-transparent pr-2 cursor-pointer"
                >
                  <VscArrowRight />
                </button>
              )}
            </form>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-inherit text-white border-none flex-shrink-0">
                <IoIosMenu className="w-8 h-8" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Plan Your Trade</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuGroup>
                {!user ? (
                  <DropdownMenuItem
                    onClick={handleAuthModalOpen}
                    className="cursor-pointer"
                  >
                    <span>Log in</span>
                    <DropdownMenuShortcut>
                      <FaUser className="h-5 w-5" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={() => setIsContactFormOpen(true)}
                      className="cursor-pointer"
                    >
                      <span>Contact</span>
                      <DropdownMenuShortcut>
                        <MdContactSupport className="h-5 w-5" />
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
        </div>
      </div>

      <ContactFormModal
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </header>
  )
}

export default HeaderClient
