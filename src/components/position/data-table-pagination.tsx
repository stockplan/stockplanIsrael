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
import SaveButton from "../SaveButton"
import { Position } from "@/schemas"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  handleAddNewTicker: () => void
  creator?: string
  saveChanges: (changes: Position[]) => Promise<void>
  tableData: Position[]
  isLoading: boolean
  unsavedChanges: boolean
}

export function DataTablePagination<TData>({
  table,
  handleAddNewTicker,
  saveChanges,
  tableData,
  creator,
  isLoading,
  unsavedChanges,
}: DataTablePaginationProps<TData>) {
  if (!creator) {
    return (
      <div className=" px-2 h-7 relative flex-col justify-start items-start flex md:w-[25%] md:text-xs">
        <LoginButton
          variant="secondary"
          className="h-8 flex text-white text-sm font-['Titillium Web] bg-background-main self-center"
        >
          <img src="\img\Plus.svg" className="mr-2 h-4 w-4" />
          Add Another Ticker
        </LoginButton>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between px-2">
      <SaveButton
        onClick={() => saveChanges(tableData)}
        isLoading={isLoading}
        disabled={!unsavedChanges}
        className="text-white lg:text-sm font-['Titillium Web'] bg-slate-700 md:w-[25%] text-xs"
      >
        <img src="\img\save-icon.svg" className="pr-2" />
        Save Changes
      </SaveButton>
      <Button
        variant="secondary"
        size="default"
        className="h-8 flex text-white lg:text-sm font-['Titillium Web] bg-background-main self-center md:w-[28%] text-xs"
        onClick={() => handleAddNewTicker()}
      >
        <img src="\img\Plus.svg" className="mr-2 h-4 w-4" />
        Add Another Ticker
      </Button>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex flex-col items-center space-y-3">
          <p className="lg:text-sm font-medium text-xs">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-6 lg:h-8 w-[65%] lg:w-[70px]">
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
        <div className="flex flex-col items-center space-y-3">
          <div className="flex w-[100px] items-center justify-center lg:text-sm text-xs font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-6 w-6 lg:h-8 lg:w-8 p-0 bg-inherit hover:bg-white hover:text-black"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-6 w-6 lg:h-8 lg:w-8 p-0 bg-inherit hover:bg-white hover:text-black"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
