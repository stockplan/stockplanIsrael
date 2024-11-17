import React from "react"
import Image from "next/image"
import Link from "next/link"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer"
import GoogleSignin from "../GoogleSignin"
import { useMediaQuery } from "usehooks-ts"

const LoginFormDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="relative h-20 bg-[#2D5686] flex items-center justify-center rounded-lg my-4 p-8 shadow-md">
              <Image src="/img/Logo.png" alt="logo" height={40} width={200} />
            </div>
            <DialogTitle className="mb-8 text-3xl text-center text-cyan-900 dark:text-white font-bold">
              Log in to unlock the <br /> best of Stocksplan.com
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="mt-10 grid space-y-4 px-8">
            <GoogleSignin />
          </div>
          <DialogFooter className="mt-14 space-y-4 py-3 text-gray-600 dark:text-gray-400 text-center">
            <div className="text-xs">
              By proceeding, you agree to our{" "}
              <Link
                href="/home/terms"
                className="underline text-blue-600 dark:text-blue-400"
              >
                Terms of Use
              </Link>{" "}
              and confirm you have read our{" "}
              <Link
                href="/home/privacy"
                className="underline text-blue-600 dark:text-blue-400"
              >
                Privacy and Cookie Statement
              </Link>
              .
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <div className="relative h-20 bg-[#2D5686] flex items-center justify-center rounded-lg my-4 p-8 shadow-md">
            <Image src="/img/Logo.png" alt="logo" height={40} width={200} />
          </div>
          <DrawerTitle className="mb-8 text-3xl text-center text-cyan-900 dark:text-white font-bold">
            Log in to unlock the <br /> best of Stocksplan.com
          </DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>
        <div className="mt-10 grid space-y-4 px-8">
          <GoogleSignin />
        </div>
        <DrawerFooter className="mt-14 space-y-4 py-3 text-gray-600 dark:text-gray-400 text-center">
          <div className="text-xs">
            By proceeding, you agree to our{" "}
            <Link
              href="/home/terms"
              className="underline text-blue-600 dark:text-blue-400"
            >
              Terms of Use
            </Link>{" "}
            and confirm you have read our{" "}
            <Link
              href="/home/privacy"
              className="underline text-blue-600 dark:text-blue-400"
            >
              Privacy and Cookie Statement
            </Link>
            .
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default LoginFormDialog
