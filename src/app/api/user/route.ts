import connectMongo from "@/lib/db"
import { createAdminClient } from "@/lib/supabase/admin"
import PositionModel from "@/models/Position"
import UserModel from "@/models/User"
import { ExtendedUser } from "@supabase/supabase-js"

import { NextRequest, NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const supabase = await createAdminClient()

    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await connectMongo()

    const usersWithTickers = await Promise.all(
      users.map(async (user) => {
        const extendedUser = user as ExtendedUser
        const dbUser = await UserModel.findOne({
          userId: extendedUser.id,
        }).populate("positions")
        if (dbUser) {
          extendedUser.maxTickers = dbUser.maxTickers

          extendedUser.stockIds = dbUser.positions
        }
        return extendedUser
      })
    )

    return NextResponse.json({ users: usersWithTickers })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    await connectMongo()
    const updates = await req.json()
    const { maxTickers, id } = updates

    if (maxTickers !== undefined && id) {
      if (
        typeof maxTickers === "number" &&
        maxTickers > 0 &&
        maxTickers <= 50
      ) {
        const res = await UserModel.findOneAndUpdate(
          { userId: id },
          { $set: { maxTickers } },
          { new: true }
        )

        return NextResponse.json({ success: true, user: res })
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid maxTickers value" },
          { status: 400 }
        )
      }
    }
    return NextResponse.json(
      { success: false, message: "Invalid input" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams

    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid id" },
        { status: 400 }
      )
    }

    await connectMongo()
    const userToDelete = await UserModel.findOne({ userId: id })

    if (!userToDelete) {
      return NextResponse.json({ success: false, message: "User not founded" })
    }

    const positionIds = userToDelete.positions

    await Promise.all([
      UserModel.findOneAndDelete({ userId: id }),
      PositionModel.deleteMany({ _id: { $in: positionIds } }),
    ])

    const supabase = await createAdminClient()
    const res = await supabase.auth.admin.deleteUser(id)

    return NextResponse.json({ success: true, data: res.data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
