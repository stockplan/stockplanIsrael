"use server"

import { ContactMessageSchema } from "@/schemas"
import axios from "axios"
import SubmitJSON from "submitjson"

import { z } from "zod"

const BASE_URL = process.env.BASE_URL

export async function clearDB() {
  // const role = await currentRole()
  // if (role !== "admin") {
  //   return { error: "Unauthorized" }
  // }

  try {
    const response = await axios.delete(`${BASE_URL}/api/position`)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to clear database: ${error.response?.statusText}`,
      contentType: error.response?.headers["content-type"],
    }
  }
}

export async function getAllUsers() {
  try {
    const response = await fetch(`${BASE_URL}/api/user`)
    return await response.json()
  } catch (error: any) {
    console.error(
      `[getAllUsers]: Failed to fetch users. Error: ${error.message}`
    )
    return { success: false, error: error.message }
  }
}

export async function getAllPositions() {
  try {
    const response = await axios.get(`${BASE_URL}/api/position`)
    return response.data
  } catch (error: any) {
    console.error(
      `[getAllPositions]: Failed to fetch positions. Error: ${error.message}`
    )
    return { success: false, error: error.message }
  }
}

export async function sendEmailToAdmin(
  userMessage: z.infer<typeof ContactMessageSchema>
) {
  try {
    const validatedUserMessage = ContactMessageSchema.safeParse(userMessage)

    if (!validatedUserMessage.success) {
      console.log(validatedUserMessage.error)
      return { error: validatedUserMessage.error.message }
    }

    const sj = new SubmitJSON({
      apiKey: process.env.SUBMIT_JSON_API_KEY as string,
      endpoint: process.env.SUBMIT_JSON_ENDPOINT,
    })

    const res = await sj.submit(validatedUserMessage.data)
    console.log(res)

    return { success: "true", data: res }
  } catch (error) {
    console.log(error)
  }
}
