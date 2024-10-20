"use client";

import React, { useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Position } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import MobileMainTicker from "./MobileMainTicker";
import Totals from "../position/totals";

interface MobileLayoutProps {
  columns: ColumnDef<Position>[]; // need to change it from table
  creator: string;
  serverUserStocks: Position[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  columns,
  creator,
  serverUserStocks,
}) => {
  const [tableData, setTableData] = useState<Position[]>(serverUserStocks);
  const [columnData, setColumnData] = useState<ColumnDef<Position>[]>(columns);
  const originalDataRef = useRef<Position[]>(serverUserStocks);
  return (
    <div className="p-4 bg-gray-800 text-white">
      <div className="text-center mb-4"></div>

      <div className="bg-gray-900 p-4 rounded-md">
        {/* <img src="/logo.png" alt="StocksPlan.com" className="mx-auto" /> */}
        <h2
          className="text-xl font-semibold mt-2"
          onClick={() => console.log(tableData, columnData)} //FOR REFRENCE
        >
          Quick Profit & Loss Calculator
        </h2>
        <MobileMainTicker />
      </div>

      <div className="mt-6 flex justify-center">
        <Button className="bg-gray-700 w-full">+ Add Ticker</Button>
      </div>

      <Totals tableData={tableData} />
    </div>
  );
};

export default MobileLayout;
