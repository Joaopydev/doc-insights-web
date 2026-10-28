import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";

import { useChats } from "../../hooks/queries/useChats";
import { cn } from "../../utils/cn";

function RecentConversations() {
  const [open, setOpen] = useState(true);
  const { chats, isLoadingChats } = useChats();
  const { chatId } = useParams();

  return (
    <div className="flex flex-col flex-1 min-h-0 mt-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium uppercase tracking-wide text-zinc-500 transition-colors duration-150 hover:text-zinc-200"
      >
        {open ? (
          <ChevronDown size={16} aria-hidden="true" />
        ) : (
          <ChevronRight size={16} aria-hidden="true" />
        )}

        <span>Recentes</span>
      </button>

      {open && (
        <ScrollArea.Root className="mt-1 min-h-0 flex-1 overflow-hidden">
          <ScrollArea.Viewport className="h-full w-full">
            {isLoadingChats && !chats ? (
              <p className="px-3 py-2 text-sm text-zinc-400">
                Carregando...
              </p>
            ) : (
              chats?.length === 0 ? (
                <p className="px-3 py-2 text-sm text-zinc-400">
                  Nenhuma conversa recente.
                </p>
              ) : (
                <nav aria-label="Conversas recentes" className="flex flex-col gap-0.5 pr-2">
                  {chats?.map((chat) => (
                    <Link
                      key={chat.id}
                      to={`/chat/${chat.id}`}
                      title={chat.name}
                      aria-current={chatId === chat.id ? "page" : undefined}
                      className={cn(
                        "block truncate rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors duration-150 hover:bg-zinc-900 hover:text-zinc-100",
                        chatId === chat.id && "bg-zinc-800 text-zinc-100 hover:bg-zinc-800"
                      )}
                    >
                      {chat.name}
                    </Link>
                  ))}
                </nav>
              )
            )}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex touch-none select-none p-0.5 transition-colors duration-[160ms] ease-out hover:bg-zinc-800 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-zinc-700 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      )}
    </div>
  );
}

export default RecentConversations;
