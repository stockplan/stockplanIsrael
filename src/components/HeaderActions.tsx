"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { Button } from "./ui/button"
import dynamic from "next/dynamic"
import Image from "next/image"
import { cn } from "@/lib/utils"
import LoginButton from "./ui/login-button"
import LogoutBtn from "./LogoutBtn"
import { VscArrowRight } from "react-icons/vsc"
import Navbar from "./navbar"

const ContactFormModal = dynamic(() => import("./ContactForm"), { ssr: false })

interface HeaderActionsProps {
  user: User | null
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ user }) => {
  const [val, setVal] = useState("")
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (/^[A-Z]*$/.test(value)) {
      setVal(value)
    }
  }

  const goToHomepage = () => {
    setVal("")
    if (user) return

    router.push("/home")
  }

  const goToDemo = (e: any) => {
    e.preventDefault()

    if (!val) return

    router.push(`/calculator/lossprofit?ticker=${val}`)
    setVal("")
  }

  return (
    <>
      {!user && (
        <form
          className="flex items-center w-1/3 bg-white py-1 px-2 lg:mt-0 rounded-sm mr-4 self-stretch"
          onSubmit={goToDemo}
        >
          <input
            type="text"
            value={val}
            disabled={!!user}
            onChange={handleChange}
            className="w-full text-base bg-transparent border-none focus:outline-none pl-2"
            placeholder="Enter a symbol (for example: AAPL)"
          />
          <button
            className={`bg-transparent pr-2 ${cn(
              !user ? "cursor-pointer" : "cursor-default"
            )}`}
          >
            {val && <VscArrowRight />}
          </button>
        </form>
      )}
      <div className="hidden md:flex items-center">
        {user && (
          <Button
            variant="ghost"
            className="border border-white text-white mr-4"
            onClick={() => setIsContactFormOpen(true)}
          >
            Contact
          </Button>
        )}
        {user ? <LogoutBtn /> : <LoginButton />}
      </div>

      <ContactFormModal
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </>
  )
}

export default HeaderActions
