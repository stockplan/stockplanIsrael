"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertDialog } from "@radix-ui/react-alert-dialog"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { AlertDialogTrigger } from "../ui/alert-dialog"
import ConfirmationModal from "../ConfirmationModal"
import LoginButton from "../ui/login-button"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  handleDeleteAll: () => void
  handleAddNewTicker: () => void
  creator?: string
}

export function DataTablePagination<TData>({
  table,
  handleDeleteAll,
  handleAddNewTicker,
  creator,
}: DataTablePaginationProps<TData>) {
  if (!creator) {
    return (
      <div className="flex items-center justify-between px-2">
        <LoginButton variant="secondary" className="h-8 flex">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Another Ticker
        </LoginButton>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between px-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="font-bold">
            Delete All
          </Button>
        </AlertDialogTrigger>
        <ConfirmationModal handleDeleteAll={handleDeleteAll} />
      </AlertDialog>
      <Button
        variant="secondary"
        size="default"
        className="h-8 flex"
        onClick={() => handleAddNewTicker()}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Another Ticker
      </Button>
      <div className="hidden flex1 items-center space-x-6 lg:space-x-8">
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
