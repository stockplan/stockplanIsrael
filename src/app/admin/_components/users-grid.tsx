"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PaginationState,
  createColumnHelper,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table"
import React, { useMemo, useState } from "react"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import CardMenu from "./card-menu"
import { ExtendedUser } from "@supabase/supabase-js"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import CurrencyInput from "react-currency-input-field"

function UserGrid({ tableData }: { tableData: ExtendedUser[] }) {
  const { toast } = useToast()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [data, setData] = useState(() => [...tableData])

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 7,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const columns = [
    columnHelper.accessor("id", {
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
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        )
      },
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("user_metadata.full_name", {
      id: "user_metadata.full_name",
      header: () => (
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          FULL NAME
        </div>
      ),
      cell: ({ getValue }) => (
        <p className="text-sm font-medium text-zinc-950 dark:text-white">
          {getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          EMAIL ADDRESS
        </p>
      ),
      cell: ({ getValue }) => (
        <p className="text-sm font-medium text-zinc-950 dark:text-white">
          {getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("created_at", {
      id: "created_at",
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          CREATED
        </p>
      ),
      cell: ({ getValue }) => (
        <div className="flex w-full items-center gap-[14px]">
          <p className="text-sm font-medium text-zinc-950 dark:text-white">
            {formatDate(getValue())}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("last_sign_in_at", {
      id: "last_sign_in_at",
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          LAST SIGN IN
        </p>
      ),
      cell: ({ getValue }) => (
        <p className="text-sm font-medium text-zinc-950 dark:text-white">
          {formatDate(getValue())}
        </p>
      ),
    }),
    columnHelper.accessor("app_metadata.provider", {
      id: "provider",
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          PROVIDER
        </p>
      ),
      cell: ({ getValue }) => (
        <div className="flex w-full items-center gap-[14px]">
          <p className="text-sm font-medium text-zinc-950 dark:text-white">
            {getValue()}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("maxTickers", {
      id: "maxTickers",
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          TOTAL TICKERS
        </p>
      ),
      cell: ({ row, table, getValue }) => {
        const [val, setVal] = useState(() => getValue() || 0)

        const handleTickerMaxBlur = () => {
          const initialValue = getValue() || 0
          if (initialValue === val) return
          if (val > 0 && val <= 50) {
            handleBlur(row.original.id, initialValue, val)
          }
        }

        return (
          <div className="flex items-center justify-center">
            <CurrencyInput
              className="bg-inherit w-12 border px-3 py-1 font-semibold"
              id={`maxTickers-${row.index}`}
              value={val}
              allowDecimals={false}
              onValueChange={(v, n, values) => setVal(values?.float || 0)}
              onBlur={handleTickerMaxBlur}
              allowNegativeValue={false}
            />
          </div>
        )
      },
    }),
    columnHelper.accessor("id", {
      id: "actions",
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400"></p>
      ),
      cell: ({ row }) => (
        <CardMenu
          row={row}
          handleDeleteUser={handleDeleteUser}
          handleBlur={handleBlur}
          vertical={true}
        />
      ),
    }),
  ]

  async function handleBlur(
    userId: string,
    initialValue: number,
    newValue: number
  ) {
    if (initialValue !== newValue) {
      if (newValue > 0 && newValue <= 50) {
        const previousUsers = [...data]
        setData((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, maxTickers: newValue } : user
          )
        )

        try {
          await axios.put(`/api/user`, { maxTickers: newValue, id: userId })
          toast({ title: "User updated successfully!" })
        } catch (error) {
          console.error("Failed to update maxTickers:", error)
          setData(previousUsers)
        }
      }
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = data.find((user) => user.id === userId)
    if (!userToDelete) return

    const updatedUsers = data.filter((user) => user.id !== userId)
    setData(updatedUsers)

    try {
      const res = await axios.delete(`/api/user?id=${userToDelete.id}`)
      if (res.data.success) {
        toast({ title: "User removed successfully!" })
      } else {
        setData((prevUsers) => [...prevUsers, userToDelete])
        toast({ title: res.data.message })
      }
    } catch (error: any) {
      console.error("Error deleting user:", error)
    }
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  return (
    <Card
      className={
        "h-full w-full border-zinc-200 p-0 dark:border-zinc-800 sm:overflow-auto"
      }
    >
      <div className="overflow-x-scroll xl:overflow-x-hidden">
        <Table className="w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableHeader
              key={headerGroup.id}
              className="border-b-[1px] border-zinc-200 p-6 dark:border-zinc-800"
            >
              <tr>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-zinc-200 pl-5 pr-4 pt-2 text-start dark:border-zinc-800"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: "",
                        desc: "",
                      }[header.column.getIsSorted() as string] ?? null}
                    </TableHead>
                  )
                })}
              </tr>
            </TableHeader>
          ))}
          <TableBody>
            {table
              .getRowModel()
              .rows.slice(0, 7)
              .map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    className="px-6 dark:hover:bg-gray-900"
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          className="w-max border-b-[1px] border-zinc-200 py-5 pl-5 pr-4 dark:border-white/10"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
        <div className="mt-2 flex h-20 w-full items-center justify-between px-6">
          <div className="flex items-center justify-between gap-3 p-4 ">
            <p
              className="text-sm font-medium text-zinc-600 "
              onClick={() => console.log(data)}
            >
              <span className="block mb-1">Showing 7 rows per page</span>
              <span className="block">Total of {data.length} users</span>
            </p>
          </div>

          {/* right side */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`flex items-center justify-center rounded-lg bg-transparent p-2 text-lg text-zinc-950 transition duration-200 hover:bg-transparent active:bg-transparent dark:text-white dark:hover:bg-transparent dark:active:bg-transparent`}
            >
              <MdChevronLeft />
            </Button>

            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`flex min-w-[34px] items-center justify-center rounded-lg bg-transparent p-2 text-lg text-zinc-950 transition duration-200 hover:bg-transparent active:bg-transparent dark:text-white dark:hover:bg-transparent dark:active:bg-transparent`}
            >
              <MdChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default UserGrid

const columnHelper = createColumnHelper<ExtendedUser>()
