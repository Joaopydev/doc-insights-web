import {  useDropzone } from "react-dropzone"
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
        <div className="px-3 flex flex-col gap-2 justify-content items-center">
            <div  {...getRootProps()} data-active={isDragActive} className="cursor-pointer w-80 text-zinc-400 bg-black/20 p-5 rounded-lg border border-zinc-700 border-dashed h-32 flex flex-col items-center justify-center gap-1 hover:border-zinc-600 transaction-colors data-[active=true]:bg-indigo-500/10 data-[active=true]:border-indigo-400">
                
                <input type="file" {...getInputProps()} />

                {isThereAnyPendingUpload ? (
                    <CircularProgressBar progress={uploadPercentage} size={54} strokeWidth={4}/>
                ) : (
                    <>
                        <span className="text-xs">
                            Solte seus arquivos aqui ou
                        </span>
                        <span className="text-xs underline">
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