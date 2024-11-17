import Link from "next/link"
import GoogleSignin from "../GoogleSignin"
import Image from "next/image"

const LoginForm = ({ showContent = true }: { showContent?: boolean }) => {
  return (
    <div>
      {showContent ? (
        <>
          <div className="relative h-20 bg-[#2D5686] flex items-center justify-center rounded-lg my-4 p-8 shadow-md">
            <Image
              src="/img/Logo.png"
              alt="logo"
              height={40}
              width={200}
              // className="h-auto w-auto"
            />
          </div>
          <h4 className="mb-8 text-3xl text-center text-cyan-900 dark:text-white font-bold">
            Log in to unlock the <br /> best of Stocksplan.com
          </h4>
        </>
      ) : null}
      <div className="mt-10 grid space-y-4 px-8">
        <GoogleSignin />
      </div>
      <div className="mt-14 space-y-4 py-3 text-gray-600 dark:text-gray-400 text-center">
        <div className="text-xs">
          By proceeding, you agree to our{" "}
          <Link
            href="/home/terms"
            className="underline text-blue-600 dark:text-blue-400"
          >
            Terms of Use
          </Link>{" "}
          and confirm you have read our{" "}
          <Link
            href="/home/privacy"
            className="underline text-blue-600 dark:text-blue-400"
          >
            Privacy and Cookie Statement
          </Link>
          .
        </div>
      </div>
    </div>
  )
}

export default LoginForm
