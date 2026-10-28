import { FileText, RefreshCcw, X, MessageSquare } from "lucide-react";

import { useUploads, type Upload } from "../../store/uploads";
import { Button } from "../button/Button";
import { useDocument } from "../../hooks/queries/useDocument";
import { useNavigate } from "react-router-dom";

interface UploadWidgetUploadItemProps {
    upload: Upload
}

export function UploadItem({
    upload,
}: UploadWidgetUploadItemProps) {
    const { cancelUpload, retryUpload, removeUpload } = useUploads()
    const { document } = useDocument({ documentId: upload?.documentId})
    const navigate = useNavigate()

    return (
        <div className="p-3 sm:p-4 rounded-xl flex flex-col gap-3 border border-zinc-800 bg-zinc-950/40 overflow-hidden [&+div]:mt-2">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                        <FileText className="size-4 text-zinc-300" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span title={upload.name} className="min-w-0 flex-1 truncate text-sm font-medium">
                        {upload.name}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                        {document?.status === "READY" && document?.conversationId && (
                            <Button
                                size="icon-sm"
                                className="px-2.5 text-indigo-300 bg-indigo-500/15 enabled:hover:bg-indigo-500/25 enabled:hover:text-indigo-200"
                                onClick={() => navigate(`/chat/${document.conversationId}`)}
                            >
                                <MessageSquare strokeWidth={1.5} className="size-4" aria-hidden="true" />
                                <span className="text-xs font-medium">
                                    Abrir chat
                                </span>
                            </Button>
                        )}

                        <Button 
                            disabled={!["error", "cancelled"].includes(upload.status)}
                            size="icon-sm"
                            className="size-8 disabled:hidden"
                            onClick={() => retryUpload(upload.id)}
                            title="Retentar upload"
                        >
                            <RefreshCcw strokeWidth={1.5} className="size-4" aria-hidden="true" />
                            <span className="sr-only">
                                Retentar upload
                            </span>
                        </Button>

                        <Button
                            disabled={upload.status === "success" && document?.status !== "READY"}
                            size="icon-sm"
                            className="size-8"
                            onClick={() => upload.status == "progress" ? cancelUpload(upload.id) : removeUpload(upload.id)}
                            title={upload.status == "progress" ? "Cancelar upload" : "Remover da lista"}
                        >
                            <X strokeWidth={1.5} className="size-4" aria-hidden="true" />
                            <span className="sr-only">
                                {upload.status == "progress" ? "Cancelar upload" : "Remover da lista"}
                            </span>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pl-10">
                    <span className="text-xs text-zinc-400 flex gap-1.5 items-center">    

                        {upload.status === "cancelled" && <span className="text-yellow-400">Cancelado</span>}
                        {upload.status === "error" && <span className="text-red-400">Erro</span>}
                        {upload.status === "success" && <span className="text-green-400">Sucesso</span>}
                        {upload.status === "progress" && <span className="text-indigo-300 animate-pulse">Em progresso...</span>}

                    </span>
                    <span className="text-xs text-zinc-600 flex items-center gap-1.5">
                        |
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                        {document?.status === "READY" && document?.conversationId ? (
                            <span className="text-green-400">Documento pronto para analise</span>
                        ) : upload.status !== "success" && upload.status === "progress" ? (
                            <span className="text-indigo-400">Aguardando upload</span>
                        ) : ["error", "cancelled"].includes(upload.status) ? (
                            <span className="text-red-400">Processamento interrompido</span>
                        ) : (
                            <span className="text-indigo-400 animate-pulse">Processando documento...</span>
                        )}
                    </span>
                </div>
            </div>
        </div>
    )
}