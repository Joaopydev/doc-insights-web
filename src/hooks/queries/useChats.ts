import { useQuery } from "@tanstack/react-query"

import { ChatService } from "../../services/ChatService"

export function useChats() {
    const { data, isFetching } = useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const { chats } = await ChatService.listUserChats()
            return chats
        }
    })

    return {
        chats: data,
        isLoadingChats: isFetching,
    }
}