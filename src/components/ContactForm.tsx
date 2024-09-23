"use client";

import React, { useState, useTransition } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog as BaseDialog,
  DialogContent as BaseDialogContent,
  DialogDescription as BaseDialogDescription,
  DialogHeader as BaseDialogHeader,
  DialogTitle as BaseDialogTitle,
} from "./ui/dialog";
import {
  Drawer as BaseDrawer,
  DrawerContent as BaseDrawerContent,
  DrawerDescription as BaseDrawerDescription,
  DrawerHeader as BaseDrawerHeader,
  DrawerTitle as BaseDrawerTitle,
} from "./ui/drawer";
import { sendEmailToAdmin } from "@/actions/admin";
import { useForm } from "react-hook-form";
import { ContactMessageSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMediaQuery } from "usehooks-ts";

interface ContactFormModalProp {
  isOpen: boolean;
  onClose: () => void;
}
function isMobileCheck() {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

const ContactFormModal = ({ isOpen, onClose }: ContactFormModalProp) => {
  // const isMobile = useMediaQuery("(min-width: 768px)");
  const isMobile = isMobileCheck();

  const ModalComponent = isMobile ? BaseDrawer : BaseDialog;
  const ContentComponent = isMobile ? BaseDrawerContent : BaseDialogContent;
  const HeaderComponent = isMobile ? BaseDrawerHeader : BaseDialogHeader;
  const TitleComponent = isMobile ? BaseDrawerTitle : BaseDialogTitle;
  const DescriptionComponent = isMobile
    ? BaseDrawerDescription
    : BaseDialogDescription;

  return (
    <ModalComponent open={isOpen} onOpenChange={onClose}>
      <ContentComponent className="sm:max-w-[425px] text-gray-700">
        <HeaderComponent>
          <TitleComponent className="text-center text-lg sm:text-xl text-gray-700">
            Contact us
          </TitleComponent>
          <DescriptionComponent className="text-center text-sm sm:text-base mt-2 text-gray-700">
            For any matter, please feel free to contact us.
          </DescriptionComponent>
        </HeaderComponent>
        <ContactForm onSubmitSuccess={onClose} />
      </ContentComponent>
    </ModalComponent>
  );
};

export default ContactFormModal;

const ContactForm = ({ onSubmitSuccess }: { onSubmitSuccess: () => void }) => {
  const form = useForm<z.infer<typeof ContactMessageSchema>>({
    resolver: zodResolver(ContactMessageSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      description: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [emailError, setEmailError] = useState<string | null>(null);

  // Filter function to check if there are non-English characters
  const hasNonEnglishCharacters = (value: string) => {
    const pattern = /^[A-Za-z0-9@._%+-]*$/; // Allowed characters
    return !pattern.test(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof z.infer<typeof ContactMessageSchema>;

    if (fieldName === "email" && hasNonEnglishCharacters(value)) {
      setEmailError("Email must contain only English characters.");
    } else {
      setEmailError(null);
    }

    form.setValue(fieldName, value); // Update the value in react-hook-form
  };

  const onSubmit = async (values: z.infer<typeof ContactMessageSchema>) => {
    startTransition(() => {
      sendEmailToAdmin(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
          }
          if (data?.success) {
            form.reset();
            onSubmitSuccess();
          }
        })
        .catch(() => alert("Something went wrong"));
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("grid gap-3 p-2")}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="firstName" className="text-sm sm:text-base">
          First Name
        </Label>
        <Input
          {...form.register("firstName", { required: true })}
          id="firstName"
          name="firstName"
          inputMode="text"
          placeholder="Enter your first name"
          maxLength={12}
          className="p-2 text-sm bg-white"
        />
        {form.formState.errors.firstName && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.firstName.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="lastName" className="text-sm sm:text-base">
          Last Name
        </Label>
        <Input
          {...form.register("lastName", { required: true })}
          id="lastName"
          name="lastName"
          inputMode="text"
          placeholder="Enter your last name"
          maxLength={12}
          className="p-2 text-sm bg-white"
        />
        {form.formState.errors.lastName && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.lastName.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-sm sm:text-base">
          Email
        </Label>
        <Input
          {...form.register("email", { required: true })}
          id="email"
          name="email"
          inputMode="email"
          type="email"
          placeholder="Enter your email"
          maxLength={30}
          required
          className="p-2 text-sm bg-white"
          onChange={handleChange}
        />
        {(form.formState.errors.email || emailError) && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.email?.message || emailError}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="text-sm sm:text-base">
          Description
        </Label>
        <textarea
          {...form.register("description", { required: true })}
          id="description"
          name="description"
          rows={4}
          placeholder="Write your description"
          maxLength={500}
          required
          className="bg-white p-2 text-sm border border-input bg-transparent shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {form.formState.errors.description && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>
      <Button type="submit" className="mt-4" disabled={isPending}>
        Send
      </Button>
    </form>
  );
};
