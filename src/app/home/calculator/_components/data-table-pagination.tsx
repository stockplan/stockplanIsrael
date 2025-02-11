"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import SaveButton from "@/components/SaveButton";
import { BsFillSaveFill } from "react-icons/bs";
import { useState } from "react";
import LoginFormDialog from "@/components/modals/login-dialog";
import { Position } from "@/types";

interface DataTablePaginationProps<TData> {
  handleAddNewTicker: () => void;
  creator?: string;
  saveChanges: (changes: Position[]) => Promise<void>;
  tableData: Position[];
  isLoading: boolean;
  unsavedChanges: boolean;
}

export function DataTablePagination<TData>({
  handleAddNewTicker,
  saveChanges,
  tableData,
  creator,
  isLoading,
  unsavedChanges,
}: DataTablePaginationProps<TData>) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);

  return (
    <div className="flex justify-center items-center relative py-2">
      <Button
        className="h-9 flex items-center justify-center text-white bg-background-main text-sm"
        onClick={creator ? handleAddNewTicker : openAuthModal}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Another Ticker
      </Button>
      {creator && (
        <SaveButton
          onClick={() => saveChanges(tableData)}
          isLoading={isLoading}
          disabled={!unsavedChanges}
          className="text-white bg-slate-700 text-sm px-4 py-2 flex items-center absolute left-0"
        >
          <BsFillSaveFill className="mr-2 h-4 w-4" />
          Save Changes
        </SaveButton>
      )}
      <LoginFormDialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </div>
  );
}
