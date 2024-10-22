import { createContext } from "react"
import { User } from "@supabase/supabase-js"

type UserDetails = { [x: string]: any } | null

export const UserContext = createContext<User | undefined | null>(undefined)
export const UserDetailsContext = createContext<UserDetails | undefined | null>(
  undefined
)
