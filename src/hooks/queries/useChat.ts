import { useQuery } from "@tanstack/react-query"

import { ChatService } from "../../services/ChatService"

type ChatParams = {
    chatId: string
}

export function useChat({ chatId }: ChatParams) {
    const { data } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
            const { chat } = await ChatService.getChatById({ chatId })
            return chat
        }
    })

    return {
        chat: data,
    }
}