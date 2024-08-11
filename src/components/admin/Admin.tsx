"use client"

import UserManagement from "./UserManagement"
import { useState } from "react"
import TickerManagement from "./TickerManagement"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { clearDB } from "@/actions/admin"
import { BackButton } from "../BackButton"

interface AdminProps {}

const Admin: React.FC<AdminProps> = ({}: AdminProps) => {
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [showTickerManagement, setShowTickerManagement] = useState(false)

  return (
    <>
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-700 ">Admin Dashboard</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Clear DB</Button>
            </AlertDialogTrigger>
            <DeleteDBModal />
          </AlertDialog>
          <BackButton
            className="w-auto text-lg"
            label="Back"
            href="/position"
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-yellow-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl text-yellow-600">Manage Users</h2>
            <button
              onClick={() => setShowUserManagement(!showUserManagement)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              {showUserManagement ? "Hide" : "View"}
            </button>
          </div>
          {showUserManagement && <UserManagement />}
          <div className="flex justify-between items-center bg-red-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl text-red-600">Manage Tickers</h2>
            <button
              onClick={() => setShowTickerManagement(!showTickerManagement)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              {showTickerManagement ? "Hide" : "View"}
            </button>
          </div>
          {showTickerManagement && <TickerManagement />}
        </div>
      </div>
    </>
  )
}

export default Admin

function DeleteDBModal({}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className=" text-black">
          Are you absolutely sure?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently remove your data
          from the servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={async () => await clearDB()}>
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

function AdminActions() {
  return (
    <>
      <div className="flex justify-between items-center bg-blue-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl text-blue-600">Change Email</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Edit
        </button>
      </div>
      <div className="flex justify-between items-center bg-green-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl text-green-600">Change Password</h2>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Edit
        </button>
      </div>
    </>
  )
}
