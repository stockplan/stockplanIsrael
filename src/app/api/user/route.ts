import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    return NextResponse.json({ msg: "User" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// import { auth } from "@/auth"
// import connectMongo from "@/lib/db"
// import UserModel from "@/models/User"
// import { NextRequest, NextResponse } from "next/server"

// export const GET = auth(async (req) => {
//   try {
//     if (!req.auth) {
//       return NextResponse.json(
//         { message: "Not authenticated" },
//         { status: 404 }
//       )
//     }

//     if (req.auth.user.role !== "admin") {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 404 })
//     }

//     await connectMongo()
//     const users = await UserModel.find().populate("positions")

//     return NextResponse.json(users)
//   } catch (error) {
//     console.log(error)
//   }
// })

// export async function POST(req: NextRequest) {
//   try {
//     const email = await req.text()

//     if (!email) {
//       return NextResponse.json({ error: "Email not founded" }, { status: 404 })
//     }

//     await connectMongo()
//     const user = await UserModel.findOne({ email })

//     if (!user) {
//       return NextResponse.json({ error: "User not founded" }, { status: 404 })
//     }

//     return NextResponse.json(user)
//   } catch (error: any) {
//     console.log(error)
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }
