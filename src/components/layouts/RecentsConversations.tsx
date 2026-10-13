import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";

import { useChats } from "../../hooks/queries/useChats";
import { cn } from "../../utils/cn";

function RecentConversations() {
  const [open, setOpen] = useState(false);
  const { chats, isLoadingChats } = useChats();
  const { chatId } = useParams();
  
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 text-zinc-400 hover:text-zinc-100"
      >
        {open ? (
          <ChevronDown size={18} />
        ) : (
          <ChevronRight size={18} />
        )}

        <span>Recentes</span>
      </button>

      {open && (
        <div className="mt-1 overflow-y-auto min-h-0">
          { isLoadingChats && !chats ? (
            <p className="px-4 py-2 text-sm text-zinc-400">
              Carregando...
            </p>
          ) : (
            chats?.length === 0 ? (
              <p className="px-4 py-2 text-sm text-zinc-400">
                Nenhuma conversa recente.
              </p>
            ) : (
              chats?.map((chat) => (
                <Link key={chat.id} to={`/chat/${chat.id}`}>
                  <p className={cn(
                    "px-4 py-2 text-sm text-zinc-400",
                    chatId === chat.id && "bg-zinc-800 text-zinc-100"
                  )}>
                    {chat.name.toUpperCase()}
                  </p>
                </Link>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
}

export default RecentConversations;