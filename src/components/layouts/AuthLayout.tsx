import { FileText } from "lucide-react"

interface AuthLayoutProps {
    title: string
    subtitle: string
    children: React.ReactNode
}

function AuthLayout({
    title,
    subtitle,
    children,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-dvh overflow-hidden bg-zinc-950">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

            <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
                <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <span className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-300">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/15">
                                <FileText size={18} className="text-indigo-400" aria-hidden="true" />
                            </span>
                            Doc Insights
                        </span>

                        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
                            {title}
                        </h1>

                        <p className="mt-2 text-zinc-400">
                            {subtitle}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout