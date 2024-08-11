"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { getURL } from "@/utils/helpers"
// import ContactFormModal from "./ContactForm"
import { Button } from "./ui/button"
import dynamic from "next/dynamic"
import Image from "next/image"

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

  const hoToHomepage = () => {
    setVal("")
    if (user) return

    const redirectUrl = getURL("/home")
    router.push(redirectUrl)
  }

  const goToDemo = (e: any) => {
    e.preventDefault()

    if (!val) return

    const redirectUrl = getURL(`/calculator/lossprofit?ticker=${val}`)
    router.push(redirectUrl)
    setVal("")
  }

  return (
    <>
      <div className=" cursor-pointer" onClick={hoToHomepage}>
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
        <button className="bg-white pr-2 cursor-pointer">Go</button>
      </form>
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
