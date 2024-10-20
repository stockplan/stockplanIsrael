"use client"

import React from "react"
import Image from "next/image"
import logoSm from "../../public/logo192.png"
import { GFS_Didot } from "next/font/google"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const gfsDidot = GFS_Didot({
  weight: "400",
  subsets: ["greek"],
  preload: false,
})

interface LogoProps {
  className?: string
  isNavigate?: boolean
}

const Logo: React.FC<LogoProps> = ({ className, isNavigate }) => {
  const router = useRouter()

  return (
    <div
      className={`flex items-center gap-1 cursor-pointer ${cn(className)}`}
      onClick={() => (isNavigate ? router.push("/home") : {})}
    >
      <Image
        src={logoSm}
        alt="logo"
        height={32}
        width={32}
        className="h-auto w-auto"
        priority
      />
      <span
        className={`${gfsDidot.className} text-[#EDD9A1] font-bold whitespace-nowrap text-sm md:text-base hidden md:block`}
      >
        StocksPlan.com
      </span>
    </div>
  )
}

export default Logo
