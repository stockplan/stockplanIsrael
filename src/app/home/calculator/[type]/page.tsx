import LandscapePopUp from "@/components/LandscapePopUp";
import { columns } from "@/app/home/calculator/_components/columns";
import { TableLossProfit } from "@/app/home/calculator/_components/table-lossprofit";
import { createClient } from "@/lib/supabase/server";
import { getEmptyRow } from "@/lib/utils";
import { getInitialData } from "@/utils";
import { getUser } from "@/utils/supabase-helpers/queries";
import { redirect } from "next/navigation";
import React from "react";
import MobileOrDesktopLayout from "@/components/shared/MobileOrDesktopLayout";

interface CalcPageProps {
  params: { type: string };
}

const TablePage = async ({ params }: CalcPageProps) => {
  const supabase = createClient();

  const { user, error } = await getUser(supabase);

  if (error && user) return redirect("/home");

  switch (params.type) {
    case "lossprofit":
      const creator = user?.id || "";

      const serverUserStocks = creator
        ? await getInitialData(creator)
        : [getEmptyRow("")];

      return (
        <MobileOrDesktopLayout
          columns={columns}
          creator={creator}
          serverUserStocks={serverUserStocks}
        />
      );
    default:
      return <div className="CalcPage">Table now found {params.type}</div>;
  }
};

export default TablePage;
