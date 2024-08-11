import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipContainerProps {
  children: React.ReactNode
  msg: string
}

const TooltipContainer: React.FC<TooltipContainerProps> = ({
  children,
  msg,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-auto">{children}</TooltipTrigger>
        <TooltipContent>
          <p>{msg}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TooltipContainer
