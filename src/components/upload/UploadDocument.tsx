import UploadDocumentDropzone from "./UploadDocumentDropzone"
import { UploadList } from "./UploadList"

function UploadDocument() {
    return (
        <div className="flex h-full flex-col items-center overflow-hidden bg-zinc-950 px-4 py-8 sm:justify-center sm:py-12">
            <div className="mb-6 shrink-0 text-center sm:mb-8">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Upload de Documento</h1>
                <p className="mt-2 text-zinc-400">Selecione um arquivo para fazer o upload.</p>
            </div>
            <div className="flex min-h-0 w-full max-w-lg flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
                <div className="shrink-0">
                    <UploadDocumentDropzone />
                </div>

                <div className="w-full h-px shrink-0 bg-zinc-800" />

                <UploadList />
            </div>
        </div>
    )
}

export default UploadDocument
