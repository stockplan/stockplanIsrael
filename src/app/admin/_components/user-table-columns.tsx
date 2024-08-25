"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { formatDate } from "@/lib/utils"
import { ExtendedUser } from "@supabase/supabase-js"
import { ColumnDef } from "@tanstack/react-table"
import ActionCell from "./actions-cell"
import MaxTickersCol from "./max-ticker-cell"

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
    cell: MaxTickersCol,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionCell,
  },
]
