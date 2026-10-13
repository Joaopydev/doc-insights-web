import { Service } from "./Service";
import type { ChatMessage, Chat, MessageType } from "../types/Chat";

export class ChatService extends Service {
    static async getChatMessages({ chatId }: ChatService.GetChatMessagesPayload): Promise<ChatService.GetChatMessagesResponse> {
        const { data } = await this.client.get(`/messages/${chatId}`)

        const messages = data.messages.map((message: ChatService.ApiMessage) => ({
            id: message.id,
            content: message.content,
            chatId: message.conversation_id,
            type: message.message_type,
            createdAt: message.created_at,
        }))

        return { messages }
    }

    static async listUserChats(): Promise<ChatService.ListUserChatsResponse> {
        const { data } = await this.client.get("/conversations")
        return { chats: data.conversations }
    }

    static async sendMessage(
        { question }: ChatService.SendMessagePayload,
        { documentId }: ChatService.SendMessageDocIdPayload
    ): Promise<ChatService.SendMessageResponse> {
        const { data } = await this.client.post("/chat", {
            question,
            document_id: documentId
        })

        return {
            message: {
                id: data.message.id,
                chatId: data.message.conversation_id,
                content: data.message.content,
                type: data.message.message_type,
                createdAt: data.message.created_at,
            }
        }
    }

    static async getChatById({ chatId }: ChatService.GetChatByIdPayload): Promise<ChatService.GetChatByIdResponse> {
        const { data } = await this.client.get(`/conversation/${chatId}`)
        return {
            chat: {
                id: data.conversation.id,
                name: data.conversation.name,
                documentId: data.conversation.document_id,
                userId: data.conversation.user_id,
                createdAt: data.conversation.created_at,
            }
        }
    }
}

export namespace ChatService {
    export type ApiMessage = {
        id: string
        content: string
        conversation_id: string
        message_type: MessageType
        created_at: string
    }

    export type GetChatMessagesPayload = {
        chatId: string
    }

    export type GetChatMessagesResponse = {
        messages: ChatMessage[]
    }

    export type ListUserChatsResponse = {
        chats: Chat[]
    }

    export type SendMessagePayload = {
        question: string,
    }

    export type SendMessageDocIdPayload = {
        documentId: string
    }

    export type SendMessageResponse = {
        message: ChatMessage
    }

    export type GetChatByIdPayload = {
        chatId: string
    }

    export type GetChatByIdResponse = {
        chat: Chat
    }
}