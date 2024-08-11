import React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog"

import GoogleSignin from "../GoogleSignin"

const AuthModal: React.FC = () => {
  return (
    <>
      <DialogHeader>
        <div className="relative h-20 bg-[#2D5686] text-cyan-900 flex items-center justify-center rounded-lg my-4 p-8 shadow-md">
          <Image
            src="/img/Logo.png"
            alt="logo"
            height={40}
            width={200}
            className="h-auto w-auto"
          />
        </div>
        <DialogTitle className="mb-8 text-3xl text-center text-cyan-900 dark:text-white font-bold">
          Log in to unlock the <br /> best of Stocksplan.com
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="mt-10 grid space-y-4 px-8">
        <GoogleSignin />
      </DialogDescription>
      <DialogFooter className="mt-14 space-y-4 py-3 text-gray-600 dark:text-gray-400 text-center">
        <div className="text-xs">
          By proceeding, you agree to our{" "}
          <Link
            href="/terms"
            className="underline text-blue-600 dark:text-blue-400"
          >
            Terms of Use
          </Link>{" "}
          and confirm you have read our{" "}
          <Link
            href="/privacy"
            className="underline text-blue-600 dark:text-blue-400"
          >
            Privacy and Cookie Statement
          </Link>
          .
        </div>
      </DialogFooter>
    </>
  )
}

export default AuthModal
