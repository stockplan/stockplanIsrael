import connectMongo from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import { getEmptyRow } from "@/lib/utils"
import PositionModel, { IPosition } from "@/models/Position"
import UserModel from "@/models/User"
import { getUser } from "@/utils/supabase-helpers/queries"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { user } = await getUser(supabase)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    await connectMongo()

    const newTickerRaw = getEmptyRow(user.id)

    const newTicker = new PositionModel(newTickerRaw)

    const [updateUserResponse, savedTickerResponse] = await Promise.all([
      UserModel.updateOne({ userId: user.id }, { $push: { positions: newTicker._id } }),
      newTicker.save(),
    ])

    console.log({ updateUserResponse })

    return NextResponse.json({ success: true, newTicker })
  } catch (error: any) {
    console.error("Error adding ticker:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add ticker",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
