"use client";

import React from "react";
import MobileAllTickers from "./MobileAllTickers";
import MobileEditorPage from "./MobileEditorPage";

import { useLossProfitState } from "./useLossprofitState";
import Totals from "@/app/home/calculator/_components/totals";

interface MobileLayoutProps {}

const MobileLayout: React.FC<MobileLayoutProps> = ({}) => {
  const { selectedTicker, creator, tickersData } = useLossProfitState();

  return (
    <div className="h-full bg-gray-900 text-white p-4">
      {selectedTicker === null && creator ? (
        <MobileAllTickers />
      ) : (
        <MobileEditorPage />
      )}
      <Totals tableData={tickersData} />
    </div>
  );
};

export default MobileLayout;
