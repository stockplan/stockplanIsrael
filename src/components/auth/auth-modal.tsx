import React from "react"
import Image from "next/image"
import Link from "next/link"

import {
  Dialog as BaseDialog,
  DialogContent as BaseDialogContent,
  DialogHeader as BaseDialogHeader,
  DialogTitle as BaseDialogTitle,
  DialogDescription as BaseDialogDescription,
  DialogFooter as BaseDialogFooter,
} from "../ui/dialog"
import {
  Drawer as BaseDrawer,
  DrawerContent as BaseDrawerContent,
  DrawerHeader as BaseDrawerHeader,
  DrawerTitle as BaseDrawerTitle,
  DrawerDescription as BaseDrawerDescription,
  DrawerFooter as BaseDrawerFooter,
} from "../ui/drawer"
import GoogleSignin from "../GoogleSignin"
import { useMediaQuery } from "usehooks-ts"

const AuthModal = ({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const ModalComponent = isDesktop ? BaseDialog : BaseDrawer
  const ContentComponent = isDesktop ? BaseDialogContent : BaseDrawerContent
  const HeaderComponent = isDesktop ? BaseDialogHeader : BaseDrawerHeader
  const TitleComponent = isDesktop ? BaseDialogTitle : BaseDrawerTitle
  const DescriptionComponent = isDesktop
    ? BaseDialogDescription
    : BaseDrawerDescription
  const FooterComponent = isDesktop ? BaseDialogFooter : BaseDrawerFooter

  return (
    <ModalComponent open={open} onOpenChange={onOpenChange}>
      <ContentComponent className="sm:max-w-md">
        <HeaderComponent>
          <div className="relative h-20 bg-[#2D5686] flex items-center justify-center rounded-lg my-4 p-8 shadow-md">
            <Image
              src="/img/Logo.png"
              alt="logo"
              height={40}
              width={200}
              // className="h-auto w-auto"
            />
          </div>
          <TitleComponent className="mb-8 text-3xl text-center text-cyan-900 dark:text-white font-bold">
            Log in to unlock the <br /> best of Stocksplan.com
          </TitleComponent>
          <DescriptionComponent />
        </HeaderComponent>
        <div className="mt-10 grid space-y-4 px-8">
          <GoogleSignin />
        </div>
        <FooterComponent className="mt-14 space-y-4 py-3 text-gray-600 dark:text-gray-400 text-center">
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
        </FooterComponent>
      </ContentComponent>
    </ModalComponent>
  )
}

export default AuthModal
