import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChatService } from "../../services/ChatService"
import type { ChatMessage, MessageType } from "../../types/Chat"


type QuestionParmas = {
    question: string
    documentId: string
}

export function useQuestion(chatId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ question, documentId }: QuestionParmas) => {
          const response = await ChatService.sendMessage(
            { question: question },
            { documentId: documentId }
          )
          return response
        },
        onMutate({ question }) {
            const newQuestion = {
                id: crypto.randomUUID(),
                chatId,
                content: question,
                type: "QUESTION" as MessageType,
                createdAt: new Date().toISOString(),
            }

            const messages =
                queryClient.getQueryData<ChatMessage[]>(
                    ["messages", chatId]
                ) ?? []

            queryClient.setQueryData<ChatMessage[]>(
                ["messages", chatId],
                [
                    ...messages,
                    newQuestion,
                ]
            )

            return {
                newQuestion,
                messages,
            }
        },
        onSuccess(data, _variables, context) {
            queryClient.setQueryData<ChatMessage[]>(
                ["messages", chatId],
                messages => {
                    if (!messages || !context?.newQuestion) {
                        return messages
                    }
                    
                    return messages.map(message => {
                        if (message.id === context.newQuestion.id) {
                            return data.message
                        }
                        return message
                    })
                }
            )
        },
        onError(_error, _variables, context) {
            if (context?.messages) {
                queryClient.setQueryData(
                    ["messages", chatId],
                    context.messages
                )
            }
        }
    })
}