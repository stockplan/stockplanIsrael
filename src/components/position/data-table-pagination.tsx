"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import LoginButton from "../ui/login-button"
import SaveButton from "../SaveButton"
import { Position } from "@/schemas"
import { BsFillSaveFill } from "react-icons/bs"

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
  handleAddNewTicker,
  saveChanges,
  tableData,
  creator,
  isLoading,
  unsavedChanges,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex justify-center items-center relative py-4">
      <Button
        className="h-10 flex items-center justify-center text-white bg-background-main text-sm px-6"
        onClick={handleAddNewTicker}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Another Ticker
      </Button>

      {creator && (
        <div className="absolute left-0">
          <SaveButton
            onClick={() => saveChanges(tableData)}
            isLoading={isLoading}
            disabled={!unsavedChanges}
            className="text-white bg-slate-700 text-sm px-4 py-2 flex items-center"
          >
            <BsFillSaveFill className="mr-2 h-4 w-4" />
            Save Changes
          </SaveButton>
        </div>
      )}
    </div>
  )
}

{
  /* <div className="hidden items-center space-x-6 lg:space-x-8">
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
      </div> */
}
