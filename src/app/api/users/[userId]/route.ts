import connectMongo from "@/lib/db"
import { getEmptyRow } from "@/lib/utils"
import PositionModel from "@/models/Position"
import UserModel from "@/models/User"
import { NextRequest, NextResponse } from "next/server"

type Params = { params: { userId: string } }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json({ error: "No user founded" }, { status: 403 })
    }

    await connectMongo()

    let user = await UserModel.findOne({ userId }).populate("positions")

    if (!user) {
      user = new UserModel({
        userId,
        role: "user",
        maxTickers: 50,
      })
      await user.save()
    }

    const stocks = user.positions || []

    if (!stocks || stocks.length === 0) {
      const newPosition = new PositionModel(getEmptyRow(userId))
      const savedPosition = await newPosition.save()
      await UserModel.findOneAndUpdate(
        { userId },
        { $push: { positions: savedPosition._id } }
      )
      const savedPositionData = savedPosition.toJSON()
      return NextResponse.json([savedPositionData])
    }

    return NextResponse.json(stocks)
  } catch (error) {
    console.error("Error in GET /api/users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
