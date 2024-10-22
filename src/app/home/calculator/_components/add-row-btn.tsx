"use client"

import { PlusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

interface AddTickleProps {
  addNewRow: any
}

export function AddTickle({ addNewRow }: AddTickleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="ml-auto h-8 flex"
      onClick={() => addNewRow()}
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      Add Another Ticker
    </Button>
  )
}
