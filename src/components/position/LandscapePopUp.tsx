"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog"
import Image from "next/image"

const LandscapePopUp = () => {
  const [isPhone, setIsPhone] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)")
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsPhone(e.matches)
    }
    setIsPhone(mediaQuery.matches)

    mediaQuery.addEventListener("change", handleMediaQueryChange)

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange)
    }
  }, [])

  const handleClose = () => {
    console.log("test")
    setDialogOpen(false)
  }

  if (!isPhone || !dialogOpen) return null

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="flex flex-col items-center py-5 w-[65%]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4"
        ></button>
        <DialogTitle className="text-center text-black text-md font-normal font-['GFS Didot'] inline w-[70%]">
          For optimal view, please rotate your mobile screen
        </DialogTitle>
        <DialogDescription>
          <Image
            src="\img\Rotate-phone-symbol.svg"
            height={88}
            width={89}
            alt="rotate phone to landscape mode"
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default LandscapePopUp
