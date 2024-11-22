"use client";

import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import MobileMainTicker from "./MobileMainTicker";
import Totals from "@/app/home/calculator/_components/totals";
import { Position } from "@/types";
import MobileSubTickers from "./MobileSubTickers";
import MobileAllTickers from "./MobileAllTickers";

interface MobileEditorPageProps {
  creator: string;
  tableData: Position[];
  onTickerSelect: (ticker: Position) => void;
  setTableData: React.Dispatch<React.SetStateAction<Position[]>>;
  setshowAllTickers: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTicker: React.Dispatch<React.SetStateAction<Position | null>>;
  selectedTicker: Position | null;
  fetchActualPrice: (ticker: string) => Promise<number>;
}

const MobileEditorPage: React.FC<MobileEditorPageProps> = ({
  creator,
  tableData,
  selectedTicker,
  setTableData,
  fetchActualPrice,
  onTickerSelect,
  setshowAllTickers,
  setSelectedTicker,
}) => {
  return (
    <>
      <div className="p-4 bg-gray-800 text-white">
        <div className="flex justify-between mb-4 gap-3">
          {creator && (
            <>
              <Button
                onClick={() => setshowAllTickers(true)}
                className="bg-gray-700"
              >
                See all Tickers
              </Button>
              <div className="overflow-x-auto w-full max-w-full">
                <MobileSubTickers
                  tableData={tableData}
                  onTickerSelect={onTickerSelect}
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-900 p-4 rounded-md">
          {/* <img src="/logo.png" alt="StocksPlan.com" className="mx-auto" /> */}
          <h2
            className="text-xl font-semibold mt-2"
            onClick={() => console.log(tableData, selectedTicker)} //FOR REFRENCE
          >
            Quick Profit & Loss Calculator
          </h2>
          <MobileMainTicker
            creator={creator}
            tableData={tableData}
            setTableData={setTableData}
            selectedTicker={selectedTicker}
            fetchActualPrice={fetchActualPrice}
            setSelectedTicker={setSelectedTicker}
          />
        </div>
        <Totals tableData={tableData} />
      </div>
    </>
  );
};

export default MobileEditorPage;
