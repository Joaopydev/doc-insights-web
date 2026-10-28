import {  useDropzone } from "react-dropzone"
import { UploadCloud } from "lucide-react"
import { usePendingUploads, useUploads } from "../../store/uploads"
import { CircularProgressBar } from "../ui/CircurlarProgressBar"


function UploadDocumentDropzone() {
    const { addUploads } = useUploads()
    const {isThereAnyPendingUpload, uploadPercentage} = usePendingUploads()

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        accept: {
        "application/pdf": [],
        },
        onDrop: (acceptedFiles) => {
            addUploads(acceptedFiles)
        },
    })

    return (
        <div className="flex flex-col gap-2 items-center">
            <div  {...getRootProps()} data-active={isDragActive} className="cursor-pointer w-full text-zinc-400 bg-zinc-950/50 p-5 rounded-xl border-2 border-zinc-700 border-dashed min-h-40 flex flex-col items-center justify-center gap-2 text-center hover:border-indigo-400/60 hover:bg-indigo-500/5 transition-colors duration-150 data-[active=true]:bg-indigo-500/10 data-[active=true]:border-indigo-400">

                <input type="file" {...getInputProps()} />

                {isThereAnyPendingUpload ? (
                    <CircularProgressBar progress={uploadPercentage} size={54} strokeWidth={4}/>
                ) : (
                    <>
                        <span className="mb-1 flex size-11 items-center justify-center rounded-full bg-indigo-500/15">
                            <UploadCloud size={22} className="text-indigo-400" aria-hidden="true" />
                        </span>
                        <span className="text-sm text-zinc-300">
                            Solte seu arquivo aqui ou
                        </span>
                        <span className="text-sm font-medium text-indigo-400 underline underline-offset-4">
                            clique para abrir o seletor de arquivos
                        </span>
                    </>
                )}

            </div>
            <span className="text-xs text-zinc-500">
                Apenas arquivos PDF são permitidos.
            </span>
        </div>
    )
}

export default UploadDocumentDropzone