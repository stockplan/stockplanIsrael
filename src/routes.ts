/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/home", "/terms", "/privacy"]

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /position
 * @type {string[]}
 */
export const authRoutes = ["/auth/callback", "/auth/confirm"]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/calculator/lossprofit"

/**
 * An Array of protected route handlers
 */
export const protectedApiRoutes = ["/api/user", "/api/save"]
