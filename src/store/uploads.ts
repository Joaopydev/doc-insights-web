import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { useShallow } from "zustand/shallow";
import { enableMapSet } from "immer"

import { DocumentService } from "../services/DocumentService"


type UploadStatus = "progress" | "success" | "error" | "cancelled"

export type Upload = {
    id: string
    name: string
    file: File
    documentId?: string
    abortController: AbortController
    status: UploadStatus
    sizeInBytes: number
    uploadSizeInBytes: number
}

type UploadState = {
    uploads: Map<string, Upload>,
    addUploads: (files: File[]) => void
    cancelUpload: (uploadId: string) => void
    retryUpload: (uploadId: string) => void
    clearUploads: () => void
    removeUpload: (uploadId: string) => void
}


enableMapSet()


export const useUploads = create<UploadState, [["zustand/immer", never]]>(
    immer((set, get) => {
        async function processUpload(uploadId: string) {
            const upload = get().uploads.get(uploadId)
            if (!upload) {
                return
            }

            try {
                const { documentId, presignedUrl } = await DocumentService.createDocument({ file: upload.file })
                updateUpload(uploadId, { documentId: documentId })

                await DocumentService.putObject(
                    {
                        file: upload.file,
                        presignedUrl,
                        onProgress(sizeInBytes) {
                            updateUpload(uploadId, { uploadSizeInBytes: sizeInBytes })
                        }
                    },
                    { signal: upload.abortController?.signal }
                )
                updateUpload(uploadId, { status: "success" })

            } catch {
                if (upload.abortController?.signal.aborted) {
                    return
                }
                updateUpload(uploadId, { status: "error" })
            }
        }

        async function cancelUpload(uploadId: string) {
            const upload = get().uploads.get(uploadId)
            if (!upload) {
                return
            }

            upload.abortController?.abort()

            if (upload?.documentId) {
                await DocumentService.deleteDocument({ documentId: upload.documentId })
            }

            updateUpload(uploadId, { status: "cancelled" })
        }

        async function addUploads(files: File[]) {
            for (const file of files) {
                const uploadId = crypto.randomUUID()
                const upload: Upload = {
                    id: uploadId,
                    name: file.name,
                    file,
                    abortController: new AbortController(),
                    status: "progress",
                    uploadSizeInBytes: 0,
                    sizeInBytes: file.size
                }

                set((state) => {
                    state.uploads.set(uploadId, upload)
                })
            }
            
            Array.from(get().uploads.entries()).map(async (data) => {
                if (data[1].status === "progress") {
                    await processUpload(data[0])
                }
            })
        }

        function updateUpload(
            uploadId: string,
            uploadData: Partial<Upload>
        ) {
            set(state => {
                const upload = state.uploads.get(uploadId)

                if (!upload) return

                Object.assign(upload, uploadData)
            })
        }

        function retryUpload(uploadId: string) {
            const upload = get().uploads.get(uploadId)

            if (!upload) {
                return
            }

            updateUpload(uploadId, {
                abortController: new AbortController(),
                status: "progress",
                uploadSizeInBytes: 0,
            })

            processUpload(uploadId)
        }

        function clearUploads() {
            set(state => {
                state.uploads.clear()
            })
        }

        async function removeUpload(uploadId: string) {
            const upload = get().uploads.get(uploadId)

            if (upload?.status == "error" && upload?.documentId) {
                await DocumentService.deleteDocument({ documentId: upload.documentId })
            }
            set(state => {
                state.uploads.delete(uploadId)
            })
        }

        return {
            uploads: new Map(),
            addUploads,
            cancelUpload,
            retryUpload,
            clearUploads,
            removeUpload,
        }
    })
)

export const usePendingUploads = () => {
    return useUploads(
        useShallow(store => {
            const isThereAnyPendingUpload = Array
            .from(store.uploads.values())
            .some(upload => upload.status == "progress")

            if (!isThereAnyPendingUpload) {
                return {
                    isThereAnyPendingUpload: isThereAnyPendingUpload,
                    uploadPercentage: 100,
                }
            }

            const {
                total,
                uploaded,
            } = Array.from(store.uploads.values()).reduce((acc, upload) => {
                if (upload.status == "progress") {
                    acc.uploaded += upload.uploadSizeInBytes
                    acc.total += upload.sizeInBytes
                }

                return acc
            },
            {total: 0, uploaded: 0})
            
            const uploadPercentage = Math.min(Math.round((uploaded * 100) / total), 100)

            return {
                isThereAnyPendingUpload,
                uploadPercentage,
            }
        })
    )
}