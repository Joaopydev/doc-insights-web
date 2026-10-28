import { LoaderCircle } from "lucide-react"
import { cn } from "../../utils/cn"

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
    size?: "default" | "icon-sm" | "icon"
    variant?: "ghost" | "primary"
}



export function Button({
    children,
    className,
    loading,
    disabled,
    size = "default",
    variant = "ghost",
    type = "button",
    ...props
}: IButtonProps) {
    const isChildrenString = typeof children === "string"

    const childEl = !isChildrenString
    ? children
    : (
        <span className="text-sm font-medium">{children}</span>
    )

    return (
        <button
            type={type}
            className={cn(
                "flex justify-center items-center gap-2 rounded-lg transition-colors duration-150 active:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed",
                size === "default" && "min-h-11 px-4 py-2",
                size === "icon-sm" && "p-1.5",
                size === "icon" && "size-10",
                variant === "ghost" && "text-zinc-400 enabled:hover:bg-zinc-800 enabled:hover:text-zinc-100",
                variant === "primary" && "bg-indigo-500 text-white enabled:hover:bg-indigo-400",
                className,
            )}
            disabled={disabled ?? loading}
            aria-busy={loading || undefined}
            {...props}
        >
            {loading ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : childEl}
        </button>
    )
}
