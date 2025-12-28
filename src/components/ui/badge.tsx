import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "border-transparent bg-primary-600 text-white hover:bg-primary-700",
        secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-gray-900 border-gray-200",
        success: "border-transparent bg-green-100 text-green-700 hover:bg-green-200",
        warning: "border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    }

    const variantStyles = variants[variant] || variants.default

    return (
        <div
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${variantStyles} ${className || ""}`}
            {...props}
        />
    )
}

export { Badge }
