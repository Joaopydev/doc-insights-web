type DocumentStatus = "UPLOADING" | "EXTRACTING" | "EXTRACTED" | "INDEXING" | "READY" | "FAILED"

export type UplodedDocument = {
    id: number
    status: DocumentStatus
    createdAt: string
    conversationId: string | null
}