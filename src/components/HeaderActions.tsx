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
      <div className="cursor-pointer" onClick={goToHomepage}>
        <Image
          src="/img/Logo.png"
          className="w-auto h-auto"
          alt="logo"
          width={166}
          height={37}
        />
      </div>
      <form
        className="flex items-center bg-white py-1 rounded-sm"
        onSubmit={goToDemo}
      >
        <input
          type="text"
          value={val}
          disabled={!!user}
          onChange={handleChange}
          className="w-full bg-transparent border-none focus-visible:right-0 focus-visible:outline-none pl-2 pe-28 "
          placeholder="AAPL"
        />
        <button
          className={`bg-white pr-2 ${cn(
            !user ? "cursor-pointer" : "cursor-default"
          )}`}
        >
          Go
        </button>
      </form>
      {user ? <LogoutBtn /> : <LoginButton />}
      {user && (
        <Button
          variant="ghost"
          className="border border-white text-white absolute  right-[162px]"
          onClick={() => setIsContactFormOpen(true)}
        >
          Contact
        </Button>
      )}
      <ContactFormModal
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </>
  )
}

export default HeaderActions
