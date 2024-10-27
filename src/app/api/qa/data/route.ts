import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/utils/supabase-helpers/queries"

import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()

    const { user, error } = await getUser(supabase)

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    if (error) {
      return NextResponse.json(error)
    }

    const searchParams = req.nextUrl.searchParams
    const contacts = searchParams.get("contacts")

    let data = null

    if (contacts) {
      const supabase = createClient()
      data = await supabase.from("contacts").select("*")
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 501 }
    )
  }
}
