export type MessageType = "QUESTION" | "ANSWER" | "WAITING-RESPONSE"

export type ChatMessage = {
    id: string
    chatId: string
    content: string
    type: MessageType
    createdAt: string
}

export type Chat = {
    id: string
    name: string
    documentId: string
    userId: string
    createdAt: string
}