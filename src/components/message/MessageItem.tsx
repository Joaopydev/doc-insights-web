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
        "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5",
        ["ANSWER", "WAITING-RESPONSE"].includes(message.type) && "self-start rounded-tl-sm bg-zinc-800/80 text-zinc-100",
        message.type === "QUESTION" && "self-end rounded-tr-sm bg-indigo-500 text-white",
        className,
      )}
    >
      <p
        className={cn(
          "text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words",
          isWaiting && "animate-pulse text-zinc-400"
        )}
        aria-live={isWaiting ? "polite" : undefined}
      >
        {message.content}
      </p>
    </div>
  )
}
