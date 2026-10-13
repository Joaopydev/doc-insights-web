import { useQuery } from "@tanstack/react-query"

import { ChatService } from "../../services/ChatService"

type MessageParamrs = {
    chatId: string 
}

export function useMessages({ chatId }: MessageParamrs) {
    const { data, isFetching } = useQuery({
        queryKey: ["messages", chatId],
        queryFn: async () => {
            const { messages } = await ChatService.getChatMessages({ chatId })
            return messages
        }
    })

    return {
        messages: data,
        isLoadingMessages: isFetching,
    }
}