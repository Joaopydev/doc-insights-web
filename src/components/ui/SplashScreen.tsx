import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { useEffect, useState } from "react"

const MESSAGES = [
    "Verificando sua sessão...",
    "Carregando seus documentos...",
    "Preparando suas conversas...",
]

// Larguras das "linhas de texto" do documento ilustrado.
const LINES = ["w-full", "w-4/5", "w-full", "w-3/5", "w-11/12", "w-2/3"]

export function SplashScreen() {
    const [messageIndex, setMessageIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((index) => (index + 1) % MESSAGES.length)
        }, 1800)

        return () => clearInterval(interval)
    }, [])

    return (
        <MotionConfig reducedMotion="user">
            <div
                role="status"
                aria-live="polite"
                className="relative flex h-dvh flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4"
            >
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

                <motion.div
                    className="relative h-28 w-22 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-2xl shadow-indigo-500/10"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    aria-hidden="true"
                >
                    <div className="flex flex-col gap-2">
                        {LINES.map((width, index) => (
                            <motion.span
                                key={index}
                                className={`h-1.5 rounded-full bg-zinc-700 ${width}`}
                                animate={{ backgroundColor: ["#3f3f46", "#818cf8", "#3f3f46"] }}
                                transition={{
                                    duration: 1.6,
                                    repeat: Infinity,
                                    delay: index * 0.18,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>

                    <motion.span
                        className="absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-indigo-400/25 to-transparent"
                        initial={{ top: "-25%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                    />
                </motion.div>

                <div className="mt-8 h-6 text-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={messageIndex}
                            className="text-sm text-zinc-400"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.25 }}
                        >
                            {MESSAGES[messageIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </MotionConfig>
    )
}
