"use client"

import React, { useState } from "react"
import { useScreen } from "usehooks-ts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog"
import Image from "next/image"

const LandscapePopUp = () => {
  const screen = useScreen()
  const [dialogOpen, setDialogOpen] = useState(true)

  let isPortrait = false

  if (screen?.orientation?.type) {
    if (
      screen.orientation.type === "portrait-primary" ||
      screen.orientation.type === "portrait-secondary"
    ) {
      isPortrait = true
    }
  }

  const handleClose = () => {
    setDialogOpen(false)
  }

  if (!isPortrait || !dialogOpen) {
    return null
  }

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
            src="/img/Rotate-phone-symbol.svg"
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
