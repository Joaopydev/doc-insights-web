import * as ScrollArea from "@radix-ui/react-scroll-area"
import { useEffect, useRef, useState } from "react"
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
    const previousMessagesRef = useRef<{
        chatId: string
        ids: Set<string>
    } | null>(null)

    const { messages, isLoadingMessages } = useMessages({ chatId })
    const { isThinkingChats, waitingForAnswer, setWaitingForAnswer } = useWebSocket()
    const isThinking = isThinkingChats[chatId] ?? false

    useEffect(() => {
        if (!viewportRef.current || !messages) return

        viewportRef.current.scrollTop = viewportRef.current.scrollHeight
    }, [chatId])

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

        // Primeira carga ou troca de conversa:
        // registra o histórico sem animar mensagens antigas.
        if (!previous || previous.chatId !== chatId) {
            previousMessagesRef.current = {
                chatId,
                ids: currentIds,
            }
            setAnimatedMessageId(null)
            return
        }

        // Procura uma resposta que não existia na lista anterior.
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
            setWaitingForAnswer(false)
            setAnimatedMessageId(newAnswer.id)
        }
    }, [messages, chatId, isLoadingMessages])

    useEffect(() => {
        if (!viewportRef.current || !messages?.length) return

        requestAnimationFrame(() => {
            if (!viewportRef.current) return
            
            viewportRef.current.scrollTo({
                top: viewportRef.current.scrollHeight,
                behavior: "smooth",
            })
        })
    }, [messages])

    return (
        <ScrollArea.Root className="min-h-0 flex-1 w-full overflow-hidden">
            <ScrollArea.Viewport
                ref={viewportRef}
                className="h-full w-full"
            >
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 pt-20">
                {isLoadingMessages && !messages ? (
                    <div className="flex w-full h-full flex-1 items-center justify-center p-4">
                        <Loader2 className="animate-spin text-zinc-400" />
                    </div>
                    ) : messages?.length === 0 ? (
                    <div className="flex h-full w-full items-center justify-center p-4">
                        <h1 className="text-xl text-zinc-400">
                            Faça suas perguntas relacionadas ao documento
                        </h1>
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
                                        <div className="bg-zinc-600 rounded-full p-1.5 h-fit">
                                            <Bot className="text-white" size={20} />
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

                            {(isThinking || waitingForAnswer) && (
                                <div className="flex gap-2">
                                    <div className="bg-zinc-600 rounded-full p-1.5 h-fit">
                                        <Bot className="text-white" size={20} />
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
                className="flex touch-none select-none bg-blackA3 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-zinc-800 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
                orientation="vertical"
            >
                <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-zinc-600 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    )
}