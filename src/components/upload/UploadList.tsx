import * as ScrollArea from "@radix-ui/react-scroll-area"

import { useUploads } from "../../store/uploads";
import { motion } from "motion/react"
import { UploadItem } from "./UploadItem";

export function UploadList() {
    const uploads = useUploads(store => store.uploads)

    const isUploadQueueEmpty = uploads.size === 0

    return (
        <div className="px-3 flex flex-col gap-3 w-full">
            <span className="text-xs font-medium">
                Arquivos enviados{' '}
                <span className="text-zinc-400">({uploads.size})</span>
            </span>

            <ScrollArea.Root className="overflow-hidden">
                <ScrollArea.Viewport className="rounded-md bg-zinc-900">
                    {isUploadQueueEmpty ? (
                        <span className="text-xs text-zinc-400 ">Nenhum upload adicionado</span>
                    ) : (
                            <motion.div
                                className="max-h-64 pr-1"
                                variants={{
                                    open: {
                                        opacity: 1,
                                        transition: {
                                            duration: 0.5
                                        }
                                    },
                                    closed: {
                                        opacity: 0,
                                    }
                                }}
                                initial="closed"
                                animate="open"
                            >
                                {[...uploads.entries()]
                                    .reverse()
                                    .map(([uploadId, upload]) => (
                                        <UploadItem key={uploadId} upload={upload} />
                                    ))
                                }
                            </motion.div>
                        )}
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                    className="flex touch-none select-none bg-blackA3 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-zinc-800 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
                    orientation="vertical"
		        >
                    <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-zinc-600 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>
        </div>
    )
}