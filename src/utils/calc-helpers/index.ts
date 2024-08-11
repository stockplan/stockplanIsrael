"use client"

import { Position } from "@/schemas"
import axios from "axios"

export const updateUserStocks = async (positions: Position[]) => {
  console.log({ positionsToSave: positions })

  // const { data } = await axios.post("/api/position/my", { positions })
  // // console.log(data)
  // return data
}

export const deleteUserStock = async (id?: string) => {
  const endpoint = !id ? "/api/position/clean" : `/api/position/my`
  const { data } = await axios.delete(endpoint, { data: { id } })
  // console.log(data)
  return data
}
