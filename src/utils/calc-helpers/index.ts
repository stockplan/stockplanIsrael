import axios from "axios"

export const deleteUserStock = async (id?: string) => {
  const endpoint = !id ? "/api/position/clean" : `/api/position/my`
  const { data } = await axios.delete(endpoint, { data: { id } })

  return data
}
