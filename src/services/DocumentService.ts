import axios from "axios";

import { Service } from "./Service";
import type { UplodedDocument } from "../types/UplodedDocument";


export class DocumentService extends Service {
    static async createDocument(
        { file }: DocumentService.CreateDocumentPayload,
    ): Promise<DocumentService.CreateDocumentResponse> {

        const { data } = await this.client.post("/document", {
            metadata: {
                filename: file.name,
                content_type: file.type
            }
        })

        return {
            documentId: data.document_id,
            presignedUrl: data.presigned_url
        }
    }

    static async putObject(
        { file, presignedUrl, onProgress }: DocumentService.PutObjectPayload,
        opts?: DocumentService.PutObjectOpts
    ) {
        await axios.put(presignedUrl, file, {
            headers: {
                "Content-Type": file.type
            },
            signal: opts?.signal,
            onUploadProgress(event) {
                onProgress(event.loaded)
            }
        })
    }

    static async deleteDocument({ documentId }: DocumentService.DeleteDocumentPayload) {
        await this.client.delete(`/document/${documentId}`)
    }

    static async getDocumentById(
        { documentId }: DocumentService.GetDocumentByIdPayload
    ): Promise<DocumentService.GetDocumentByIdResponse> {
        const { data } = await this.client.get(`/document/${documentId}`)

        return {
            document: {
                id: data.document.id,
                status: data.document.status,
                createdAt: data.document.created_at,
                conversationId: data.document.conversation_id, 
            }
        }
    }
}

export namespace DocumentService {
    export type CreateDocumentPayload = {
        file: File,
    }

    export type PutObjectPayload = {
        file: File,
        presignedUrl: string
        onProgress: (sizeInBytes: number) => void
    }

    export type CreateDocumentResponse = {
        documentId: string
        presignedUrl: string
    }

    export type DeleteDocumentPayload = {
        documentId: string
    }

    export type GetDocumentByIdPayload = {
        documentId: string
    }

    export type GetDocumentByIdResponse = {
        document: UplodedDocument
    }

    export interface PutObjectOpts {
        signal?: AbortSignal
    }
}