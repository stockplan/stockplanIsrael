// HeaderClient.tsx
"use client"

import { useState } from "react"
import { User } from "@supabase/supabase-js"
import { VscArrowRight } from "react-icons/vsc"
import { cn } from "@/lib/utils"
import LogoutBtn from "./auth/LogoutBtn"
import { Button } from "./ui/button"
import Logo from "./logo"
import ContactFormDialog from "./modals/contact-dialog"
import HeaderNavMobile from "./header-nav-mobile"
import LoginFormDialog from "./modals/login-dialog"
import Form from "next/form"

interface HeaderClientProps {
  user: User | null
  isAdmin: boolean
}

const HeaderClient: React.FC<HeaderClientProps> = ({ user, isAdmin }) => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const handleAuthModalOpen = () => {
    setIsAuthModalOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^[a-zA-Z]*$/.test(e.target.value)) {
      setInputValue(e.target.value.toUpperCase())
    }
  }
  return (
    <header className={cn(`bg-header shadow-lg py-2`)} id="header-main">
      <div className="flex items-center justify-between mx-5">
        <Logo className="cursor-pointer h-auto" isNavigate />

        {!user && (
          <Form
            onSubmit={() => setInputValue("")}
            className="flex items-center rounded-full w-full md:w-1/3 mx-2 bg-white py-1 px-2 lg:mt-0 md:rounded-sm self-stretch"
            action={`/home/calculator/lossprofit`}
          >
            <input
              name="ticker"
              type="text"
              value={inputValue}
              onChange={handleChange}
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
          </Form>
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
              {isAdmin && (
                <Form action="/admin">
                  <Button
                    variant="ghost"
                    className=" text-white bg-green-700 ml-4 px-4 py-2 rounded"
                  >
                    Manager
                  </Button>
                </Form>
              )}
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

        <HeaderNavMobile user={user!} />
      </div>

      <ContactFormDialog
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />

      <LoginFormDialog
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
      />
    </header>
  )
}

export default HeaderClient
