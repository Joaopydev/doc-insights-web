import type { ChatMessage } from "../../types/Chat"
import { cn } from "../../utils/cn"

interface MessageProps {
  message: ChatMessage;
  className?: string
}

export function MessageItem({ message, className }: MessageProps) {
  const isWaiting = message.type === "WAITING-RESPONSE";

  return (
    <div
      className={cn(
        "max-w-[70%] rounded-lg px-4 py-3",
        ["ANSWER", "WAITING-RESPONSE"].includes(message.type) && "self-start bg-zinc-800",
        message.type === "QUESTION" && "self-end bg-blue-500",
        className,
      )}
    >
      <p
        className={cn(
          "text-sm text-white",
          isWaiting && "animate-pulse"
        )}
      >
        {message.content}
      </p>
    </div>
  )
}