"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"

import ContactForm from "../forms/contact-form"
import { useMediaQuery } from "usehooks-ts"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer"

interface ContactFormModalProp {
  isOpen: boolean
  onClose: () => void
}

const ContactFormDialog = ({ isOpen, onClose }: ContactFormModalProp) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] text-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center text-lg sm:text-xl text-gray-700">
              Contact us
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base mt-2 text-gray-700">
              For any matter, please feel free to contact us.
            </DialogDescription>
          </DialogHeader>
          <ContactForm onSubmitSuccess={onClose} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="sm:max-w-[425px] text-gray-700">
        <DrawerHeader>
          <DrawerTitle className="text-center text-lg sm:text-xl text-gray-700">
            Contact us
          </DrawerTitle>
          <DrawerDescription className="text-center text-sm sm:text-base mt-2 text-gray-700">
            For any matter, please feel free to contact us.
          </DrawerDescription>
        </DrawerHeader>
        <ContactForm onSubmitSuccess={onClose} />
      </DrawerContent>
    </Drawer>
  )
}

export default ContactFormDialog
