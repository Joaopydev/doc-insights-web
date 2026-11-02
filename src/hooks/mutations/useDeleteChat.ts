import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChatService } from "../../services/ChatService"


export function useDeleteChat(chatId: string) {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async () => {
            await ChatService.deleteChatById({ chatId })
        },
        onSuccess() {
            queryClient.removeQueries({ queryKey: ["chat", chatId] })
            queryClient.removeQueries({ queryKey: ["messages", chatId] })
            queryClient.invalidateQueries({ queryKey: ["chats"] })
        },
    })
}