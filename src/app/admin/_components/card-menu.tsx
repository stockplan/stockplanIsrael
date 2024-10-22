import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ExtendedUser } from "@supabase/supabase-js"
import { Row } from "@tanstack/react-table"
import React, { useState } from "react"
import { AiOutlineUser } from "react-icons/ai"
import { AiOutlineShop } from "react-icons/ai"
import { BsThreeDots } from "react-icons/bs"
import UserStocksModal from "./user-stocks"

interface CardMenuProps {
  transparent?: boolean
  vertical?: boolean
  handleBlur: (
    userId: string,
    initialValue: number,
    newValue: number
  ) => Promise<void>
  handleDeleteUser: (useeId: string) => Promise<void>
  row: Row<ExtendedUser>
}

function CardMenu({
  transparent,
  vertical,
  handleBlur,
  handleDeleteUser,
  row,
}: CardMenuProps) {
  const [open, setOpen] = useState(false)
  const [openUserData, setOpenUserData] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={() => setOpen(!open)}
            className={`flex items-center text-xl hover:cursor-pointer ${
              transparent
                ? "bg-transparent text-white hover:bg-transparent active:bg-transparent"
                : vertical
                ? "bg-transparent text-zinc-950 hover:bg-transparent active:bg-transparent dark:text-white dark:hover:bg-transparent dark:active:bg-transparent"
                : "bg-lightPrimary text-brand-500 p-2 hover:bg-gray-100 dark:bg-zinc-950 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10"
            } justify-center rounded-lg font-bold transition duration-200`}
          >
            {vertical ? (
              <p className="text-2xl hover:cursor-pointer">
                <BsThreeDots />
              </p>
            ) : (
              <BsThreeDots className="h-6 w-6" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[80] w-40 border-zinc-200 dark:border-zinc-800">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <p
                onClick={() => setOpenUserData(true)}
                className="flex cursor-pointer items-center gap-2 text-zinc-800 hover:font-medium hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
              >
                <span>
                  <AiOutlineUser />
                </span>
                View User Tickers
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <p
                onClick={() => handleDeleteUser(row.original.id)}
                className="mt-2 flex cursor-pointer items-center gap-2 pt-1 text-zinc-950 hover:font-medium hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
              >
                <span>
                  <AiOutlineShop />
                </span>
                Remove user
              </p>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {openUserData && (
        <UserStocksModal
          isOpen={openUserData}
          onClose={() => setOpenUserData(false)}
          positions={row.original.stockIds}
        />
      )}
    </>
  )
}

export default CardMenu
