import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { CardWrapper } from "./CardWrapper"

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/home"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive h-5" />
      </div>
    </CardWrapper>
  )
}
