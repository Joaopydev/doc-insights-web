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
        <div className="relative flex min-h-screen overflow-hidden bg-zinc-950">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

            <div className="relative flex flex-1 items-center justify-center px-6">
                <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
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