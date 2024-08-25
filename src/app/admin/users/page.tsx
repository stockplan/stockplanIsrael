import React from "react"
import { ContentLayout } from "../_components/content-layout"
import { getUsersWithTickers } from "@/actions/admin"
import UserManagement from "../_components/user-table"

interface UserPageProps {}

const UserPage: React.FC<UserPageProps> = async ({}) => {
  const users = (await getUsersWithTickers()) || []

  return (
    <div className="container pt-8 pb-8 px-4 sm:px-8">
      <UserManagement initialData={users} />
    </div>
  )
}

export default UserPage
