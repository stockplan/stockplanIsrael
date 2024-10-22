import { createClient } from "@/lib/supabase/server"
import { getContactMessages } from "@/utils/supabase-helpers/queries"
import React from "react"

const AdminInquiriesPage = async () => {
  const supabase = createClient()
  const messages = (await getContactMessages(supabase)) || []

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Admin - Inquiries</h1>
      {messages.length === 0 ? (
        <div className="text-center">No messages found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-gray-800">
                <th className="py-2 px-4 border text-gray-200">ID</th>
                <th className="py-2 px-4 border text-gray-200">Name</th>
                <th className="py-2 px-4 border text-gray-200">Email</th>
                <th className="py-2 px-4 border text-gray-200">Message</th>
                <th className="py-2 px-4 border text-gray-200">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border">{message.id}</td>
                  <td className="py-2 px-4 border">
                    {message.first_name} {message.last_name}
                  </td>
                  <td className="py-2 px-4 border">{message.email}</td>
                  <td className="py-2 px-4 border">{message.description}</td>
                  <td className="py-2 px-4 border">
                    {new Date(message.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminInquiriesPage
