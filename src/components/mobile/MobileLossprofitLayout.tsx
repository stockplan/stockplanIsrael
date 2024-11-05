"use client";

import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import MobileMainTicker from "./MobileMainTicker";
import Totals from "@/app/home/calculator/_components/totals";
import { Position } from "@/types";
import MobileSubTickers from "./MobileSubTickers";

interface MobileLayoutProps {
  creator: string;
  serverUserStocks: Position[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  creator,
  serverUserStocks,
}) => {
  const [tableData, setTableData] = useState<Position[]>(serverUserStocks);
  const [selectedTicker, setSelectedTicker] = useState<Position | null>(null);

  // current ticker displayed with all data in main ticker
  const handleTickerSelect = (ticker: Position) => {
    setSelectedTicker(ticker);
  };

  const fetchActualPrice = async (ticker: string) => {
    try {
      const response = await fetch(
        `/api/tickerPrice?ticker=${ticker.toUpperCase()}`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.fetchedPrice;
    } catch (error) {
      console.error(`Error fetching actual price for ${ticker}:`, error);
      return 0; // Fallback price or error handling
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white">
      <div className="flex justify-between mb-4 gap-3">
        <Button className="bg-gray-700">See all Tickers</Button>
        <div className="overflow-x-auto w-full max-w-full">
          <MobileSubTickers
            tableData={tableData}
            onTickerSelect={handleTickerSelect}
          />
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded-md">
        {/* <img src="/logo.png" alt="StocksPlan.com" className="mx-auto" /> */}
        <h2
          className="text-xl font-semibold mt-2"
          onClick={() => console.log(tableData)} //FOR REFRENCE
        >
          Quick Profit & Loss Calculator
        </h2>
        <MobileMainTicker
          creator={creator}
          tableData={tableData}
          setTableData={setTableData}
          selectedTicker={selectedTicker}
          fetchActualPrice={fetchActualPrice}
        />
      </div>

      <Totals tableData={tableData} />
    </div>
  );
};

export default MobileLayout;
