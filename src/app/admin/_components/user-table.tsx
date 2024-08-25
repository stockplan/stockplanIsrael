"use client"

import React, { useMemo, useState } from "react"
import axios from "axios"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"

import { ExtendedUser } from "@supabase/supabase-js"
import { userColumns } from "@/app/admin/_components/user-table-columns"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"

interface UserManagementProps {
  initialData: ExtendedUser[]
}

const UserManagement = ({ initialData }: UserManagementProps) => {
  const [users, setUsers] = useState(initialData)

  const { toast } = useToast()

  const handleBlur = async (
    userId: string,
    initialValue: number,
    newValue: number
  ) => {
    if (initialValue !== newValue) {
      if (newValue > 0 && newValue <= 50) {
        const previousUsers = [...users]
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, maxTickers: newValue } : user
          )
        )

        try {
          await axios.put(`/api/user`, { maxTickers: newValue, id: userId })
          toast({ title: "User updated successfully!" })
        } catch (error) {
          console.error("Failed to update maxTickers:", error)
          setUsers(previousUsers)
        }
      }
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find((user) => user.id === userId)
    if (!userToDelete) return

    const updatedUsers = users.filter((user) => user.id !== userId)
    setUsers(updatedUsers)

    try {
      const res = await axios.delete(`/api/user?id=${userToDelete.id}`)
      if (res.data.success) {
        toast({ title: "User removed successfully!" })
      } else {
        setUsers((prevUsers) => [...prevUsers, userToDelete])
        toast({ title: res.data.message })
      }
    } catch (error: any) {
      console.error("Error deleting user:", error)
    }
  }

  const memoColumns = useMemo<ColumnDef<ExtendedUser>[]>(() => userColumns, [])
  const table = useReactTable({
    data: users,
    columns: memoColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    meta: {
      handleDeleteUser,
      handleBlur,
    },
  })

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
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-inherit hover:bg-white hover:text-black"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-inherit hover:bg-white hover:text-black"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
