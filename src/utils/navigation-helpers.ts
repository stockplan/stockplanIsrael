import { IRoute } from "@/types"

// Boolean toggle to determine whether auth interface should route through server or client
// (Currently set to false because screen sometimes flickers with server redirects)
const allowServerRedirect = false

export const findCurrentRoute = (
  routes: IRoute[],
  pathname: string
): IRoute | undefined => {
  for (let route of routes) {
    if (route.items) {
      const found = findCurrentRoute(route.items, pathname)
      if (found) return found
    }

    // Use startsWith instead of match to ensure correct route detection
    if (pathname.startsWith(route.path)) {
      return route
    }
  }
}

export const getActiveRoute = (routes: IRoute[], pathname: string): string => {
  const route = findCurrentRoute(routes, pathname)
  return route?.name || "Default Brand Text"
}

export const getActiveNavbar = (
  routes: IRoute[],
  pathname: string
): boolean => {
  const route = findCurrentRoute(routes, pathname)
  if (route?.secondary) return route?.secondary
  else return false
}

export const getActiveNavbarText = (
  routes: IRoute[],
  pathname: string
): string | boolean => {
  return getActiveRoute(routes, pathname) || false
}

export const getRedirectMethod = () => {
  return allowServerRedirect ? "server" : "client"
}
