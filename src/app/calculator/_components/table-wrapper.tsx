"use client";

import React, { useEffect, useState } from "react";

import { Position } from "@/schemas";
import { TableLossProfit } from "@/components/position/table-lossprofit";

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

  useEffect(() => {
    // Check if there's data in localStorage
    const localData = localStorage.getItem("unsavedChanges");
    if (localData) {
      const parsedData = JSON.parse(localData);

      // Use local data instead of server data
      setUserStocks(parsedData);
    }
  }, []);

  return (
    <TableLossProfit
      columns={columns}
      creator={creator}
      userStocks={userStocks}
    />
  );
};

export default TableLossProfitWrapper;
