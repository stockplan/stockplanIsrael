import { DataTableColumnHeader } from "@/components/position/data-table-column-header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { ExtendedUser } from "@supabase/supabase-js"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import CurrencyInput from "react-currency-input-field"
import UserStocksModal from "./user-stocks"

export const userColumns: ColumnDef<ExtendedUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user_metadata.full_name",
    header: () => <div className=" text-gray-900">Full name</div>,
    cell: ({ row }) => row.original.user_metadata.full_name || "N/A",
  },
  {
    accessorKey: "email",
    header: () => <div className=" text-gray-900">Email</div>,
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "created_at",
    header: () => <div className=" text-gray-900 ">Registration Date</div>,
    cell: ({ row }) => (
      <div className="font-medium">
        {formatDate(row.getValue("created_at"))}
      </div>
    ),
  },
  {
    accessorKey: "last_sign_in_at",
    header: () => <div className="text-gray-900">Last Login</div>,
    cell: ({ row }) => (
      <div className="font-medium">
        {formatDate(row.getValue("last_sign_in_at"))}
      </div>
    ),
  },
  {
    accessorKey: "app_metadata.provider",
    header: () => <div className=" text-gray-900">Provider</div>,
    cell: ({ row }) => row.original.app_metadata.provider || "N/A",
  },
  {
    accessorKey: "maxTickers",
    header: () => <div className="text-gray-900">Total Tickers</div>,
    cell: ({ row, table }) => {
      const userId = row.original.id
      const initialValue = row.getValue("maxTickers") as number
      const [tickerValue, setTickerValue] = useState<string>(
        initialValue.toString()
      )

      const handleTickerChange = (value: string | undefined) => {
        setTickerValue(value || "0")
      }

      const handleBlur = () => {
        const newValue = +tickerValue
        if (initialValue !== newValue) {
          if (newValue > 0 && newValue <= 50) {
            table.options.meta?.handleBlur(userId, initialValue, newValue)
          }
        }
      }

      return (
        <div className="flex items-center justify-center">
          <CurrencyInput
            className="bg-inherit w-12 border px-3 py-1 font-semibold"
            id={`maxTickers-${row.index}`}
            value={tickerValue}
            allowDecimals={false}
            onValueChange={handleTickerChange}
            onBlur={handleBlur}
            allowNegativeValue={false}
          />
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
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
    },
  },
]
