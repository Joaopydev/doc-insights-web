import { LoaderCircle } from "lucide-react"
import { cn } from "../../utils/cn"

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
    size?: "default" | "icon-sm"
}



export function Button({
    children,
    className,
    loading,
    disabled,
    size = "default",
    ...props
}: IButtonProps) {
    const isChildrenString = typeof children === "string"

    const childEl = !isChildrenString
    ? children 
    : (
        <span className="text-base font-medium">{children}</span>
    )

    return (
        <button
            className={cn(
                "flex justify-center items-center active:opacity-85 disabled:opacity-40",
                size === "default" && "px-3 py-2",
                size === "icon-sm" && "p-1",
                className,
            )}
            disabled={disabled ?? loading}
            {...props}
        >
            {loading ? <LoaderCircle className="animate-spin" color="#000"/> : childEl}
        </button>
    )
}