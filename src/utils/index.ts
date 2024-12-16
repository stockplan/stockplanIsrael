import { Position } from "@/types"
import { getURL } from "./helpers"
import axios from "axios"

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

export function hasDataChanged1(arr1: Position[], arr2: Position[]) {
  return JSON.stringify(arr1) === JSON.stringify(arr2)
}

//prettier-ignore
export function hasDataChanged(arr1: Position[], arr2: Position[]): boolean {
  // Check if both arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

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

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(this: unknown, ...args: Parameters<T>) {
    // Clear the previous timer if the function is called again before the wait time ends.
    if (timeout) clearTimeout(timeout)

    // Set a new timer. Only after 'wait' milliseconds without new calls will 'func' be executed.
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
