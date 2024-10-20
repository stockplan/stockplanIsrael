import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"
interface TooltipContainerProps {
  children: React.ReactNode
  msg: string
}

const TooltipContainer: React.FC<TooltipContainerProps> = ({
  children,
  msg,
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-auto">{children}</HoverCardTrigger>
      <HoverCardContent>
        <p>{msg}</p>
      </HoverCardContent>
    </HoverCard>
  )
}

export default TooltipContainer
