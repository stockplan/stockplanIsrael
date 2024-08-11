import connectMongo from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import { getEmptyRow } from "@/lib/utils"
import PositionModel, { IPosition } from "@/models/Position"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No user founded" }, { status: 403 })
    }

    const userId = user.id
    await connectMongo()

    let stocks = await PositionModel.find({ creator: userId }).lean()

    if (!stocks || stocks.length === 0) {
      const newPosition = new PositionModel(getEmptyRow(userId))
      const savedPosition = await newPosition.save()

      const savedPositionData = savedPosition.toJSON()
      return NextResponse.json([savedPositionData])
    }

    return NextResponse.json(stocks)
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No user founded" }, { status: 403 })
    }

    const { positions } = await req.json()
    // console.log(positions)

    const userId = user.id
    await connectMongo()

    let updatedPositions: IPosition[] = await Promise.all(
      positions.map(async (positionData: IPosition) => {
        if (positionData._id) {
          return await PositionModel.findByIdAndUpdate(
            positionData._id,
            { $set: positionData },
            { new: true }
          )
        } else {
          const newPosition = new PositionModel({
            ...positionData,
            creator: userId,
          })
          return await newPosition.save()
        }
      })
    )

    return NextResponse.json(updatedPositions)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No user founded" }, { status: 403 })
    }

    const { id } = await req.json()
    await connectMongo()

    await PositionModel.findByIdAndDelete(id)
    return NextResponse.json({ message: "Row deleted successfully" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
