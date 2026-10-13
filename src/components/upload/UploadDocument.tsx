import UploadDocumentDropzone from "./UploadDocumentDropzone"
import { UploadList } from "./UploadList"

function UploadDocument() {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-zinc-950 overflow-hidden rounded-xl gap-1">
            <h1 className="text-2xl font-bold mb-4">Upload de Documento</h1>
            <p className="text-zinc-400 mb-8">Selecione um arquivo para fazer o upload.</p>    
            <div className="flex flex-col items-center justify-center p-10 bg-zinc-900 rounded-xl gap-4">       
                <UploadDocumentDropzone />

                <div className="w-full h-px bg-zinc-800" />

                <UploadList />
            </div>
        </div>
    )
}

export default UploadDocument