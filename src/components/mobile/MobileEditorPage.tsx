"use client";

import React from "react";
import { Button } from "../ui/button";
import MobileMainTicker from "./MobileMainTicker";
import Totals from "@/app/home/calculator/_components/totals";
import { Position } from "@/types";
import MobileSubTickers from "./MobileSubTickers";
import Logo from "../logo";

interface MobileEditorPageProps {
  creator: string;
  tickersData: Position[];
  editedticker: Position;
  saveChanges: (changes: Position[]) => void;
  deleteTicker: (tickerToDelete: Position | null) => void;
  addNewTicker: () => void;
  setEditedTicker: React.Dispatch<React.SetStateAction<Position>>;
  emptyPosition: Position;
  onTickerSelect: (ticker: Position) => void;
  setTickersData: React.Dispatch<React.SetStateAction<Position[]>>;
  setshowAllTickers: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTicker: React.Dispatch<React.SetStateAction<Position | null>>;
  selectedTicker: Position | null;
}

const MobileEditorPage: React.FC<MobileEditorPageProps> = ({
  creator,
  tickersData,
  editedticker,
  emptyPosition,
  setEditedTicker,
  saveChanges,
  deleteTicker,
  addNewTicker,
  selectedTicker,
  setTickersData,
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
                  tickersData={tickersData}
                  onTickerSelect={onTickerSelect}
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-900 p-4 rounded-md">
          <Logo isNavigate={false} />
          <h2
            className="text-xl font-semibold mt-2"
            onClick={() => {
              console.log("editedticker: ", editedticker);
              console.log("selectedTicker: ", selectedTicker);
              console.log("tickersData: ", tickersData);
            }} //FOR REFRENCE
          >
            Quick Profit & Loss Calculator
          </h2>
          <MobileMainTicker
            editedticker={editedticker}
            emptyPosition={emptyPosition}
            setEditedTicker={setEditedTicker}
            setTickersData={setTickersData}
            selectedTicker={selectedTicker}
          />
        </div>

        {selectedTicker ? (
          <div className="mt-4 flex justify-center">
            <Button
              className="bg-blue-600 w-full"
              onClick={() => saveChanges(tickersData)}
            >
              Save Changes
            </Button>
          </div>
        ) : null}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => deleteTicker(selectedTicker)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => setSelectedTicker(null)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Clear Ticker
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <Button className="bg-gray-700 w-full" onClick={addNewTicker}>
            + Add Ticker
          </Button>
        </div>

        <Totals tableData={tickersData} />
      </div>
    </>
  );
};

export default MobileEditorPage;
