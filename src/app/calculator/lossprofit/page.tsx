import { columns } from "@/components/position/columns";
import { TableLossProfit } from "@/components/position/table-lossprofit";
import { getEmptyRow } from "@/lib/utils";
import { redirect } from "next/navigation";
import getServerUser from "@/utils/auth-helpers/getServerUser";
import { getInitialData } from "@/utils";
import TableLossProfitWrapper from "../_components/table-wrapper";

const Page = async ({}) => {
  const {
    data: { user },
    error,
  } = await getServerUser();

  if (error && user) return redirect("/home");

  const creator = user?.id || "";

  const serverUserStocks = creator
    ? await getInitialData(creator)
    : [getEmptyRow("")];

  return (
    <div className="z-20 relative h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <TableLossProfitWrapper
        columns={columns}
        creator={creator}
        serverUserStocks={serverUserStocks}
      />
    </div>
  );
};

export default Page;
