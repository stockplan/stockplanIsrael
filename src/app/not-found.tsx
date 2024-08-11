import { LogoutButton } from "@/components/LogoutButton"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen z-20 relative flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Oops! Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          {`It looks like you took a wrong turn on the trading floor. Let's get
          you back on track!`}
        </p>

        <LogoutButton className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Return Home
        </LogoutButton>
      </div>
      <p className="mt-4 text-gray-500">
        Need help? Contact support at{" "}
        <Link href="mailto:tobeb3107@gmail.com" className="underline">
          support@gmail.com
        </Link>
      </p>
    </div>
  )
}
