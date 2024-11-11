"use client"

import { signout } from "@/actions/logout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserContext } from "@/contexts/layout"
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle"
import Link from "next/link"
import React, { useContext } from "react"
import { FiAlignJustify } from "react-icons/fi"
import {
  HiOutlineInformationCircle,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2"

export default function HeaderLinks(props: { [x: string]: any }) {
  const user = useContext(UserContext)

  const { toggleIsOpen } = useSidebarToggle()

  return (
    <div className="relative flex min-w-max max-w-max flex-grow items-center justify-around gap-1 rounded-lg md:px-2 md:py-2 md:pl-3 xl:gap-2">
      <Button
        onClick={() => toggleIsOpen()}
        variant="outline"
        className="flex h-9 min-w-9 cursor-pointer rounded-full border-zinc-200 p-0 text-xl text-zinc-950  md:min-h-10 md:min-w-10 xl:hidden"
      >
        <FiAlignJustify className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex h-9 min-w-9 cursor-pointer rounded-full border-zinc-200 p-0 text-xl text-zinc-950 dark:border-zinc-800 dark:text-white md:min-h-10 md:min-w-10"
          >
            <HiOutlineInformationCircle className="h-[20px] w-[20px] text-zinc-950 dark:text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-2">
          <Link target="blank" href="#" className="w-full">
            <Button variant="outline" className="mb-2 w-full">
              Pricing
            </Button>
          </Link>
          <Link target="blank" href="mailto:hello@horizon-ui.com">
            <Button variant="outline" className="mb-2 w-full">
              Help & Support
            </Button>
          </Link>
          <Link target="blank" href="/#faqs">
            <Button variant="outline" className="w-full">
              FAQs & More
            </Button>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      <form action={signout}>
        <Button
          variant="outline"
          className="flex h-9 min-w-9 cursor-pointer rounded-full border-zinc-200 p-0 text-xl text-zinc-950 dark:border-zinc-800 dark:text-white md:min-h-10 md:min-w-10"
        >
          <HiOutlineArrowRightOnRectangle className="h-4 w-4 stroke-2 text-zinc-950 dark:text-white" />
        </Button>
      </form>

      <Link className="w-full" href="#">
        <Avatar className="h-9 min-w-9 md:min-h-10 md:min-w-10">
          <AvatarImage src={user?.user_metadata.avatar_url} />
          <AvatarFallback className="font-bold">
            {user?.user_metadata.full_name
              ? `${user?.user_metadata.full_name[0]}`
              : `${user?.email![0].toUpperCase()}`}
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  )
}
