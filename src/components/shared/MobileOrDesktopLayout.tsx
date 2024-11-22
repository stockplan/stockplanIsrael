"use client";
import useIsMobile from "@/hooks/useIsMobile";
import MobileLossprofitLayout from "@/components/mobile/MobileLossprofitLayout";
import { ColumnDef } from "@tanstack/react-table";
import { Position } from "@/types";
import { TableLossProfit } from "@/app/home/calculator/_components/table-lossprofit";
// import TableLossProfitWrapper from "@/app/home/calculator/_components/table-wrapper";

interface MobileOrDesktopLayoutProps {
  creator: string;
  serverUserStocks: Position[];
}

const MobileOrDesktopLayout: React.FC<MobileOrDesktopLayoutProps> = ({
  creator,
  serverUserStocks,
}) => {
  const isMobile = useIsMobile(); // Use the hook inside this client-side component

  return isMobile ? (
    <MobileLossprofitLayout
      creator={creator}
      serverUserStocks={serverUserStocks}
    />
  ) : (
    <TableLossProfit creator={creator} serverUserStocks={serverUserStocks} />
  );
};

export default MobileOrDesktopLayout;
