import * as ScrollArea from "@radix-ui/react-scroll-area"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Loader2, Bot } from "lucide-react"

import { MessageItem } from "./MessageItem"
import { useMessages } from "../../hooks/queries/useMessages"
import { useWebSocket } from "../../contexts/webscoket/useWebScoket"
import { cn } from "../../utils/cn"

interface MessagesListProps {
    chatId: string
}

export function MessagesList({ chatId }: MessagesListProps) {
    const [animatedMessageId, setAnimatedMessageId] = useState<string | null>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const initialScrollChatIdRef = useRef<string | null>(null)
    const previousMessagesRef = useRef<{
        chatId: string
        ids: Set<string>
    } | null>(null)

    const { messages, isLoadingMessages } = useMessages({ chatId })
    const { isThinkingChats } = useWebSocket()
    const isThinking = isThinkingChats[chatId] ?? false

    useEffect(() => {
        if (!animatedMessageId) return

        const timeout = setTimeout(() => {
            setAnimatedMessageId(null)
        }, 500)

        return () => clearTimeout(timeout)
    }, [animatedMessageId])

    useEffect(() => {
        if (isLoadingMessages || !messages) return

        const currentIds = new Set(messages.map((message) => message.id))
        const previous = previousMessagesRef.current

        if (!previous || previous.chatId !== chatId) {
            previousMessagesRef.current = {
                chatId,
                ids: currentIds,
            }
            setAnimatedMessageId(null)
            return
        }

        const newAnswer = [...messages]
            .reverse()
            .find(
                (message) =>
                    !previous.ids.has(message.id) &&
                    message.type !== "QUESTION" &&
                    message.type !== "WAITING-RESPONSE"
            )

        previousMessagesRef.current = {
            chatId,
            ids: currentIds,
        }

        if (newAnswer) {
            setAnimatedMessageId(newAnswer.id)
        }
    }, [messages, chatId, isLoadingMessages])

    // useLayoutEffect roda antes da pintura: ao abrir uma conversa, a primeira
    // renderização das mensagens já aparece no fim, sem rolar a partir do topo.
    useLayoutEffect(() => {
        const viewport = viewportRef.current
        if (!viewport || !messages?.length) return

        if (initialScrollChatIdRef.current !== chatId) {
            viewport.scrollTop = viewport.scrollHeight
            initialScrollChatIdRef.current = chatId
            return
        }

        requestAnimationFrame(() => {
            if (!viewportRef.current) return
            
            viewportRef.current.scrollTo({
                top: viewportRef.current.scrollHeight,
                behavior: "smooth",
            })
        })
    }, [messages, chatId])

    if (isLoadingMessages && !messages) {
        return (
            <div className="flex min-h-0 flex-1 w-full items-center justify-center">
                <Loader2 className="animate-spin text-zinc-400" aria-label="Carregando mensagens" />
            </div>
        )
    }

    return (
        <ScrollArea.Root className="min-h-0 flex-1 w-full overflow-hidden">
            <ScrollArea.Viewport
                ref={viewportRef}
                className="h-full w-full"
            >
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-6 pb-4 md:pt-10">
                {messages?.length === 0 ? (
                    <div className="flex w-full flex-col items-center justify-center gap-3 py-24 text-center">
                        <span className="flex size-12 items-center justify-center rounded-full bg-indigo-500/15">
                            <Bot className="text-indigo-400" size={24} aria-hidden="true" />
                        </span>
                        <h1 className="text-lg font-medium text-zinc-200 text-balance">
                            Faça suas perguntas relacionadas ao documento
                        </h1>
                        <p className="text-sm text-zinc-500">
                            As respostas são baseadas no conteúdo do PDF enviado.
                        </p>
                    </div>
                    ) : (
                        <>
                            {messages?.map((message) => {
                                if (message.type == "QUESTION") {
                                    return (
                                        <MessageItem
                                            key={message.id}
                                            message={message}
                                        />
                                    )
                                }
                                return (
                                    <div className="flex gap-2" 
                                        key={message.id}>
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/15" aria-hidden="true">
                                            <Bot className="text-indigo-400" size={18} />
                                        </div>
                                        <MessageItem
                                            key={message.id}
                                            message={message}
                                            className={cn(
                                                message.id === animatedMessageId && "animate-message-enter"
                                            )}
                                        />
                                    </div>
                                )
                            })}

                            {isThinking  && (
                                <div className="flex gap-2">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/15" aria-hidden="true">
                                        <Bot className="text-indigo-400" size={18} />
                                    </div>
                                    <MessageItem
                                        message={{
                                            id: "waiting-response",
                                            chatId,
                                            content: "Buscando respostas...",
                                            type: "WAITING-RESPONSE",
                                            createdAt: new Date().toISOString(),
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )
                }
            </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
                className="flex touch-none select-none p-0.5 transition-colors duration-[160ms] ease-out hover:bg-zinc-800 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
                orientation="vertical"
            >
                <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-zinc-700 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    )
}