import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"
import { ButtonHTMLAttributes, FC } from "react"
import { RiLoader2Fill } from "react-icons/ri"

const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-500",
        ghost: "bg-transparent hover:text-blue-600 hover:bg-blue-200",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const SaveButton: FC<ButtonProps> = ({
  className,
  children,
  variant,
  isLoading,
  size,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      {children}
    </button>
  )
}

export default SaveButton
