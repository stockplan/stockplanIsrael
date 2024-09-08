"use client";

import React, { useEffect, useState } from "react";

import { Position } from "@/schemas";
import { TableLossProfit } from "@/components/position/table-lossprofit";
import { useToast } from "@/components/ui/use-toast";

interface TableLossProfitWrapperProps {
  columns: any;
  creator: string;
  serverUserStocks: Position[];
}

const TableLossProfitWrapper: React.FC<TableLossProfitWrapperProps> = ({
  columns,
  creator,
  serverUserStocks,
}) => {
  const [userStocks, setUserStocks] = useState(serverUserStocks);
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's data in localStorage
    const localData = localStorage.getItem("unsavedChanges");
    if (localData) {
      const parsedData = JSON.parse(localData);

      // Show a message to the user that local data was loaded
      toast({
        description: "Local changes detected. Please save your changes.",
        variant: "default", // Or 'destructive' if it's an urgent message
      });

      // Use local data instead of server data
      setUserStocks(parsedData);
    }
  }, [toast]);

  return (
    <TableLossProfit
      columns={columns}
      creator={creator}
      userStocks={userStocks}
    />
  );
};

export default TableLossProfitWrapper;
