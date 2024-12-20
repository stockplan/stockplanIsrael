import { userAgent, type NextRequest } from "next/server"
import { updateSession } from "./lib/supabase/middleware"

function checkDevice(request: NextRequest) {
  const url = request.nextUrl
  const { device } = userAgent(request)
  const viewport = device.type === "mobile" ? "mobile" : "desktop"
  url.searchParams.set("viewport", viewport)
}

export async function middleware(request: NextRequest) {
  checkDevice(request)
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
