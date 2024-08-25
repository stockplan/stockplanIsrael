import React from "react"
import { ContentLayout } from "../_components/content-layout"
import { getUsers, getUsersWithTickers } from "@/actions/admin"
import UserManagement from "../_components/user-table"

interface UserPageProps {}

const UserPage: React.FC<UserPageProps> = async ({}) => {
  const users = await getUsersWithTickers()
  return (
    <ContentLayout title="Users">
      <UserManagement initialData={users} />
    </ContentLayout>
  )
}

export default UserPage
