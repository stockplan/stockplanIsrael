"use client"

import React, { useState } from "react"
import { formatDate } from "@/lib/utils"
import axios from "axios"
import { Position } from "@/schemas"
import useSWR from "swr"
import { BeatLoader } from "react-spinners"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Checkbox } from "../ui/checkbox"
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import CurrencyInput from "react-currency-input-field"
import { Button } from "../ui/button"

interface UserManagementProps {}

// prettier-ignore
const userFetcher =  () =>  fetch("/api/user").then((res) => res.json())

const UserManagement = ({}: UserManagementProps) => {
  const {
    data: users = [],
    mutate,
    isLoading,
  } = useSWR("/api/user", userFetcher, {
    revalidateOnFocus: false,
  })

  const [tickerValues, setTickerValues] = useState<Record<string, string>>({})
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({})

  const handleTickerChange = (userId: string, value: string) => {
    setTickerValues((prev) => ({
      ...prev,
      [userId]: value,
    }))
  }

  const handleBlur = async (userId: string, initialValue: string) => {
    const newValue = tickerValues[userId]
    if (initialValue !== newValue) {
      if (+newValue > 0 && +newValue <= 50) {
        await axios.put(`/api/user/${userId}`, { maxTickers: newValue })
      }
    }
  }

  const toggleRowOpen = (userId: string) => {
    setOpenRows((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  const columns: ColumnDef<any>[] = [
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
      accessorKey: "username",
      header: () => <div className=" text-gray-900">Username</div>,
      cell: ({ row }) => <div className="">{row.getValue("username")}</div>,
    },
    {
      accessorKey: "email",
      header: () => <div className=" text-gray-900">Email</div>,
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className=" text-gray-900 ">Registration Date</div>,
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt")
        const formatted = formatDate(createdAt)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "lastLoginDate",
      header: () => <div className="text-gray-900">Last Login</div>,
      cell: ({ row }) => {
        const lastLoginDate = row.getValue("lastLoginDate")
        const formatted = formatDate(lastLoginDate)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "maxTickers",
      header: () => <div className="text-gray-900">Total Tickers</div>,
      cell: ({ row }) => {
        const userId = row.original._id
        const initialValue = row.getValue("maxTickers") as string
        const value = tickerValues[userId] || initialValue

        return (
          <div className="flex items-center justify-center">
            <CurrencyInput
              className="bg-inherit w-12 border px-3 py-1 font-semibold"
              id={`maxTickers-${row.index}`}
              value={value}
              allowDecimals={false}
              onValueChange={(value: any) =>
                handleTickerChange(userId, value || "0")
              }
              onBlur={() => handleBlur(userId, initialValue)}
              allowNegativeValue={false}
            />
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        const isOpen = openRows[user._id]

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
                  onClick={() => navigator.clipboard.writeText(user._id)}
                >
                  Copy user ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toggleRowOpen(user._id)}>
                  View user tickers
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDeleteUser(user._id)}>
                  Remove user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isOpen && <UserPositions positions={user.positions || []} />}
          </>
        )
      },
    },
  ]

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find((user: any) => user._id === userId)
    if (!userToDelete) return

    const updatedUsers = users.filter((user: any) => user._id !== userId)
    mutate(updatedUsers, false)

    try {
      await axios.delete(`/api/user/${userToDelete._id}`)
      console.log("User deleted successfully")
      // Revalidate data after successful deletion
      mutate()
    } catch (error) {
      console.error("Error deleting user:", error)
      // Revert the optimistic update if the deletion fails
      mutate()
    }
  }

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    meta: {
      handleDeleteUser,
    },
  })

  if (isLoading) return <BeatLoader />
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader onClick={() => console.log(users)}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className=" text-white text-sm h-12 text-center font-bold"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody id="TABLE_BODY">
          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map((row) => (
                <TableRow className="" id={"row_" + row.id} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      id={cell.id}
                      className="h-14 text-gray-600"
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  )
}

export default UserManagement

function UserPositions({ positions }: { positions: Position[] }) {
  return (
    <div className="flex flex-col gap-4 mt-2">
      {positions &&
        positions.length > 0 &&
        positions.map((position: Position) => (
          <div
            key={position._id!.toString()}
            className="bg-gray-200 p-2 rounded-lg text-gray-800 w-96"
          >
            <p className="font-medium">Ticker: {position.ticker}</p>
            <p>Actual Price: {position.actualPrice}</p>
            <p>Quantity: {position.quantity}</p>
            <p>Ask Price: {position.askPrice}</p>
            <p>Exit Price: {position.exitPrice}</p>
            <p>Stop Loss: {position.stopLoss}</p>
          </div>
        ))}
    </div>
  )
}
