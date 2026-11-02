import { forwardRef } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { CircleAlert, X } from "lucide-react"

interface AuthErrorAlertProps {
    title?: string
    message: string | null
    // Muda a cada falha para re-disparar o "shake" mesmo com a mesma mensagem.
    attempt: number
    onDismiss: () => void
}

export const AuthErrorAlert = forwardRef<HTMLDivElement, AuthErrorAlertProps>(
    function AuthErrorAlert({ title = "Não foi possível entrar", message, attempt, onDismiss }, ref) {
        const reduceMotion = useReducedMotion()

        return (
            <AnimatePresence initial={false}>
                {message && (
                    <motion.div
                        key={attempt}
                        ref={ref}
                        role="alert"
                        tabIndex={-1}
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                        animate={
                            reduceMotion
                                ? { opacity: 1 }
                                : { opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }
                        }
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                    >
                        <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-red-400" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-300">{title}</p>
                            <p className="mt-0.5 text-sm text-zinc-300">{message}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onDismiss}
                            aria-label="Fechar aviso"
                            className="-m-1.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-red-500/40 outline-none"
                        >
                            <X aria-hidden className="size-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        )
    }
)
