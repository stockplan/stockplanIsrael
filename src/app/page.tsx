import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { redirect } from "next/navigation"

export default async function Home() {
  return redirect("/home")

  return <div>Home page</div>
}
