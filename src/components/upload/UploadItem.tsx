import { ImageUp, RefreshCcw, X, MessageSquare } from "lucide-react";

import { useUploads, type Upload } from "../../store/uploads";
import { Button } from "../button/Button";
import { cn } from "../../utils/cn";
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
        <div className="p-4 rounded-lg flex flex-col gap-3 shadow-shape-content bg-white/5 relative overflow-hidden [&+div]:mt-2">
            <div className="flex flex-col gap-2">
                <span className="text-xs font-medium flex items-center gap-1">
                    <ImageUp className="size-3 text-zinc-300" strokeWidth={1.5} />
                    <span title={upload.name}>
                        {upload.name.length > 20 ? `${upload.name.slice(0, 20)}...` : upload.name}
                    </span>
                </span>

                <div className="flex flex-row gap-1 pt-5">
                    <span className="text-xs text-zinc-400 flex gap-1.5 items-center">    

                        {upload.status === "cancelled" && <span className="text-yellow-400">Upload Cancelado</span>}
                        {upload.status === "error" && <span className="text-red-400">Error</span>}
                        {upload.status === "success" && <span className="text-green-400">Upload Finalizado</span>}
                        {upload.status === "progress" && <span className="text-blue-400">Em progresso...</span>}

                    </span>
                    <span className="text-xs text-zinc-600 flex items-center gap-1.5">
                        |
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                        {document?.status === "READY" ? (
                            <span className="text-orange-400">Documento pronto para analise</span>
                        ) : (
                            <span className="text-indigo-500">Documento sendo processado...</span>
                        )}
                    </span>
                </div>
            </div>

            <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                {document?.status === "READY" && document?.conversationId && (
                    <Button
                        size="icon-sm"
                        onClick={() => navigate(`/chat/${document.conversationId}`)}
                    >
                        <MessageSquare
                            strokeWidth={1.5}
                            className="size-4 text-zinc-400"
                        />
                        <span className="text-xs text-zinc-400 p-1 underline hover:text-zinc-300">
                            Abrir chat
                        </span>
                    </Button>
                )}

                <Button 
                  disabled={!["error", "cancelled"].includes(upload.status)}
                  size="icon-sm"
                  onClick={() => retryUpload(upload.id)}
                >
                    <RefreshCcw 
                        strokeWidth={1.5}
                        className={cn(
                            "size-4 text-zinc-400", 
                            ["error", "cancelled"].includes(upload.status) && "hover:text-zinc-300"
                        )}
                    />
                    <span className="sr-only">
                        Retentar upload
                    </span>
                </Button>

                <Button
                    disabled={upload.status === "success" && document?.status !== "READY"}
                    size="icon-sm"
                    onClick={() => upload.status == "progress" ? cancelUpload(upload.id) : removeUpload(upload.id)}
                >
                    <X 
                        strokeWidth={1.5}
                        className={cn(
                            "size-4 text-zinc-400",
                            (["error", "cancelled", "progress"].includes(upload.status) ||
                            upload.status === "success" && document?.status === "READY") &&
                            "hover:text-zinc-300",
                        )}
                    />
                    <span className="sr-only">
                        Cancelar upload
                    </span>
                </Button>
            </div>
        </div>
    )
}