import { createClient } from "@/lib/supabase/server"
import getServerUser from "@/utils/auth-helpers/getServerUser"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const {
      data: { user },
      error,
    } = await getServerUser()

    if (!user || error) {
      return NextResponse.json({ error })
    }

    const searchParams = req.nextUrl.searchParams
    const contacts = searchParams.get("contacts")

    let data = null
    if (contacts) {
      const supabase = createClient()
      data = await supabase.from("contacts").select("*")
    }

    return NextResponse.json({ data })
  } catch (error) {}
}
