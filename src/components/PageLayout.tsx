import { PageTemplate } from '@prisma/client';
import { PageRenderer } from '@/components/PageRenderer';
import { CustomHTML } from '@/components/security/SafeHTML';

interface PageLayoutProps {
    headerTemplate?: PageTemplate | null;
    footerTemplate?: PageTemplate | null;
    headerSections?: any[] | null;
    footerSections?: any[] | null;
    contentTemplate?: PageTemplate | null;
    children: React.ReactNode;
    className?: string;
    translationGroupId?: string | null;
}

// Helper to replace system settings placeholders
const replaceSystemSettings = (content: string, settings: Record<string, string>) => {
    if (!content) return content;
    let result = content;
    Object.entries(settings).forEach(([key, value]) => {
        // Replace {{ key }} and {{key}}
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        result = result.replace(regex, value || '');
    });
    return result;
};

export default async function PageLayout({
    headerTemplate,
    footerTemplate,
    headerSections,
    footerSections,
    contentTemplate,
    children,
    className = '',
    translationGroupId,
}: PageLayoutProps) {
    // Fetch settings for replacement
    const settings = await (await import('@/lib/system-settings')).getSystemSettings();

    const processedHeader = headerTemplate ? {
        ...headerTemplate,
        content: replaceSystemSettings(headerTemplate.content, settings)
    } : null;

    const processedFooter = footerTemplate ? {
        ...footerTemplate,
        content: replaceSystemSettings(footerTemplate.content, settings)
    } : null;

    return (
        <div className={`min-h-screen flex flex-col ${className}`} data-translation-group-id={translationGroupId || ''}>
            {/* Header */}
            {headerTemplate ? (
                // If page has a specific header template, use it
                headerTemplate.sections && Array.isArray(headerTemplate.sections) && headerTemplate.sections.length > 0 ? (
                    <PageRenderer sections={headerTemplate.sections as any[]} systemSettings={settings} />
                ) : (
                    processedHeader && (
                        <>
                            {processedHeader.style && (
                                <style dangerouslySetInnerHTML={{ __html: processedHeader.style }} />
                            )}
                            <CustomHTML html={processedHeader.content} />
                        </>
                    )
                )
            ) : (
                // Otherwise fall back to global header sections
                headerSections && Array.isArray(headerSections) && headerSections.length > 0 && (
                    <PageRenderer sections={headerSections} systemSettings={settings} />
                )
            )}

            {/* Main Content */}
            <main className="flex-grow">
                {contentTemplate ? (
                    <>
                        {contentTemplate.style && (
                            <style dangerouslySetInnerHTML={{ __html: contentTemplate.style }} />
                        )}
                        <CustomHTML html={contentTemplate.content} />
                    </>
                ) : (
                    children
                )}
            </main>

            {/* Footer */}
            {footerTemplate ? (
                // If page has a specific footer template, use it
                footerTemplate.sections && Array.isArray(footerTemplate.sections) && footerTemplate.sections.length > 0 ? (
                    <PageRenderer sections={footerTemplate.sections as any[]} systemSettings={settings} />
                ) : (
                    processedFooter && (
                        <>
                            {processedFooter.style && (
                                <style dangerouslySetInnerHTML={{ __html: processedFooter.style }} />
                            )}
                            <CustomHTML html={processedFooter.content} />
                        </>
                    )
                )
            ) : (
                // Otherwise fall back to global footer sections
                footerSections && Array.isArray(footerSections) && footerSections.length > 0 && (
                    <PageRenderer sections={footerSections} systemSettings={settings} />
                )
            )}
        </div>
    );
}
