"use client";

import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Position } from "@/types";
import MobileAllTickers from "./MobileAllTickers";
import MobileEditorPage from "./MobileEditorPage";

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
  const [showAllTickers, setshowAllTickers] = useState<boolean>(true);

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
  // work from big to small, all ticker presented then goes to the main ticker presented and the small onces above. do the oppesite with the see all tickers
  return (
    <div>
      {showAllTickers ? (
        <>
          <MobileAllTickers
            selectedTicker={selectedTicker}
            tableData={tableData}
            onTickerSelect={handleTickerSelect}
            setshowAllTickers={setshowAllTickers}
          />
        </>
      ) : (
        <MobileEditorPage
          creator={creator}
          tableData={tableData}
          setTableData={setTableData}
          selectedTicker={selectedTicker}
          fetchActualPrice={fetchActualPrice}
          onTickerSelect={handleTickerSelect}
          setshowAllTickers={setshowAllTickers}
          setSelectedTicker={setSelectedTicker}
        />
      )}
    </div>
  );
};

export default MobileLayout;
