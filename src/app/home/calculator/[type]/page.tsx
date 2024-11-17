import LandscapePopUp from "@/components/LandscapePopUp"
import { TableLossProfit } from "@/app/home/calculator/_components/table-lossprofit"
import { createClient } from "@/lib/supabase/server"
import { getEmptyRow } from "@/lib/utils"
import { getInitialData } from "@/utils"
import { getUser } from "@/utils/supabase-helpers/queries"
import { redirect } from "next/navigation"
import React from "react"

interface CalcPageProps {
  params: Promise<{ type: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

const TablePage = async ({ params, searchParams }: CalcPageProps) => {
  const supabase = await createClient()

  const { user, error } = await getUser(supabase)

  if (error && user) return redirect("/home")

  const { ticker } = await searchParams

  const { type } = await params

  const creator = user?.id || ""

  switch (type) {
    case "lossprofit":
      const serverUserStocks = creator
        ? await getInitialData(creator)
        : [getEmptyRow(creator, ticker)]

      return (
        <TableLossProfit
          creator={creator}
          serverUserStocks={serverUserStocks}
        />
      )
    default:
      return <div className="CalcPage">Table now found {type}</div>
  }
}

export default TablePage
