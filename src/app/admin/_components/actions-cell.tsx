"use client"

import { ExtendedUser } from "@supabase/supabase-js"
import { CellContext } from "@tanstack/react-table"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import UserStocksModal from "./user-stocks"

type CellType = CellContext<ExtendedUser, unknown>

const ActionCell: React.FC<CellType> = ({ row, column, table }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}
          >
            Copy user ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            View user tickers
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              table.options.meta?.handleDeleteUser(row.original.id)
            }
          >
            Remove user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isOpen && (
        <UserStocksModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          positions={row.original.stockIds}
        />
      )}
    </>
  )
}

export default ActionCell
