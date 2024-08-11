import connectMongo from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import { getEmptyRow } from "@/lib/utils"
import PositionModel from "@/models/Position"
import UserModel from "@/models/User_old"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
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

    await Promise.all([
      PositionModel.deleteMany({ creator: userId }),
      UserModel.findOneAndUpdate({ userId }, { $set: { positions: [] } }),
    ])

    // הוספת שורה ריקה חדשה
    // const newPosition = new PositionModel(getEmptyRow(userId))
    // const savedPosition = await newPosition.save()

    return NextResponse.json({
      message: "All rows deleted and one empty row added",
      //   newPosition: savedPosition,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
