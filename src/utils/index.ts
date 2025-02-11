import { Position } from "@/types"
import { getURL } from "./helpers"
import axios from "axios"
import hash from "hash-sum"

export async function getInitialData(userId: string) {
  try {
    const redirectUrl = getURL(`/api/users/${userId}`)
    const response = await axios.get(redirectUrl)
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error("Error fetching initial data:", error)
    return []
  }
}

function filterPosition(
  position: Position
): Omit<Position, "actualPrice" | "_id" | "id" | "creator" | "createdAt" | "updatedAt"> {
  const { actualPrice, _id, id, creator, createdAt, updatedAt, ...filtered } = position
  return filtered
}

//prettier-ignore
export function hasDataChanged(arr1: Position[], arr2: Position[]): boolean {
  // Check if both arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  const hash1 = hash(arr1.map(filterPosition))
  const hash2 = hash(arr2.map(filterPosition))
  // console.log({hash1,hash2})
  
  
  return hash1 === hash2

  // Iterate through each element in the arrays
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    // Extract keys without 'actualPrice', '_id', and 'id' for comparison
    const keys1 = Object.keys(obj1).filter(
      (key) => key !== "actualPrice" && key !== "_id" && key !== "id"
    ) as (keyof Position)[]; // casting keys to keyof Position
    const keys2 = Object.keys(obj2).filter(
      (key) => key !== "actualPrice" && key !== "_id" && key !== "id"
    ) as (keyof Position)[];

    // Check if both objects have the same keys (excluding 'actualPrice', '_id', 'id')
    if (
      keys1.length !== keys2.length ||
      !keys1.every((key) => keys2.includes(key))
    ) {
      return false;
    }

    // Compare each key-value pair, ignoring 'actualPrice'
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
  }

  return true;
}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args)
      lastArgs = null
      timeout = null
    }, wait)
  }) as T & { flush: () => void }

  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout)
      if (lastArgs) {
        func(...lastArgs)
      }
      lastArgs = null
      timeout = null
    }
  }

  return debounced
}
