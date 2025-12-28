import * as React from "react"

const TabsContext = React.createContext<{
    value: string
    onValueChange: (value: string) => void
} | null>(null)

const Tabs = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value?: string; onValueChange?: (value: string) => void; defaultValue?: string }
>(({ className = "", value, onValueChange, defaultValue, ...props }, ref) => {
    const [innerValue, setInnerValue] = React.useState(defaultValue || "")
    const actualValue = value !== undefined ? value : innerValue
    const handleValueChange = onValueChange || setInnerValue

    return (
        <TabsContext.Provider value={{ value: actualValue, onValueChange: handleValueChange }}>
            <div ref={ref} className={className} {...props} />
        </TabsContext.Provider>
    )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
    <div
        ref={ref}
        className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className = "", value, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    const active = context?.value === value
    return (
        <button
            ref={ref}
            type="button"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
      ${active ? 'bg-background text-foreground shadow-sm bg-white text-gray-900 border border-gray-200' : 'hover:bg-gray-50 hover:text-gray-900 text-gray-500'} 
      ${className}`}
            onClick={() => context?.onValueChange(value)}
            {...props}
        />
    )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className = "", value, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    if (context?.value !== value) return null

    return (
        <div
            ref={ref}
            className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
            {...props}
        />
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
