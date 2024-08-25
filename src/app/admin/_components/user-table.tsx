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

interface UserManagementProps {
  initialData: ExtendedUser[]
}

const UserManagement = ({ initialData }: UserManagementProps) => {
  const [users, setUsers] = useState(initialData)

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
      // await axios.delete(`/api/user?id=${userToDelete.id}`)
    } catch (error) {
      console.error("Error deleting user:", error)
      setUsers((prevUsers) => [...prevUsers, userToDelete])
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
    </div>
  )
}

export default UserManagement
