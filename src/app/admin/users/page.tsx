import React from "react"
import UserGrid from "../_components/users-grid"

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_VERCEL_URL
    : typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000"

const UserPage = async () => {
  const response = await fetch(`${BASE_URL}/api/user`)
  const data = await response.json()
  const userTableData = data.users || []

  return (
    <div className="h-full w-full">
      <div className="h-full w-full rounded-lg ">
        <UserGrid tableData={userTableData} />
      </div>
    </div>
  )
}

export default UserPage
