export default function TemplateBuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // No AdminLayout wrapper - pure builder interface
    return children;
}
