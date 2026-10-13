import { useQuery, useQueryClient } from "@tanstack/react-query"
import { DocumentService } from "../../services/DocumentService"
import type { UplodedDocument } from "../../types/UplodedDocument"


type DocumentParams = {
    documentId: string | undefined
}

export function useDocument({ documentId }: DocumentParams) {
    const queryClient = useQueryClient()
    const { data } = useQuery<UplodedDocument>({
        enabled: !!documentId,
        queryKey: ["document", documentId],
        queryFn: async () => {
            if (!documentId) {
                throw new Error("documentId is required.")
            }
            const { document } = await DocumentService.getDocumentById({ documentId })
            return document
        },
        refetchInterval: (query) => {
            if (query.state.data?.status === "READY" && query.state.data.conversationId) {
                queryClient.invalidateQueries({
                    queryKey: ["chats"]
                })

                return false
            }

            return 2_000
        }
    })
    return {
        document: data,
    }
}