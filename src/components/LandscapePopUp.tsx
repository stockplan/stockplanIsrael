// src/components/LandscapePopUp.tsx

"use client"

import React, { useState, useLayoutEffect } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog"

const LandscapePopUp = () => {
  const [isPortrait, setIsPortrait] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useLayoutEffect(() => {
    const checkIsPortrait = () => {
      if (
        window.screen &&
        window.screen.orientation &&
        window.screen.orientation.type
      ) {
        return (
          window.screen.orientation.type === "portrait-primary" ||
          window.screen.orientation.type === "portrait-secondary"
        )
      } else {
        return window.innerHeight > window.innerWidth
      }
    }

    const portrait = checkIsPortrait()
    setIsPortrait(portrait)
    setDialogOpen(portrait)

    const handleOrientationChange = () => {
      const portraitMode = checkIsPortrait()
      setIsPortrait(portraitMode)
      setDialogOpen(portraitMode)
    }

    window.addEventListener("orientationchange", handleOrientationChange)
    window.addEventListener("resize", handleOrientationChange)

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange)
      window.removeEventListener("resize", handleOrientationChange)
    }
  }, [])

  if (!isPortrait || !dialogOpen) {
    return null
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg w-11/12 max-w-md animate-fadeIn">
        <DialogTitle className="text-center text-gray-800 text-lg font-semibold mb-4">
          For optimal viewing, please rotate your phone to landscape mode
        </DialogTitle>
        <DialogDescription className="flex flex-col items-center">
          <Image
            src="/svg/Rotate-phone-symbol.svg"
            height={100}
            width={100}
            alt="Rotate your phone to landscape mode"
            className="mb-4"
          />
          <p className="text-center text-gray-600">
            This will allow you to enjoy an improved user experience and clearer
            data.
          </p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default LandscapePopUp
