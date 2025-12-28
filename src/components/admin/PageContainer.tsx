import { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
    title?: string;
    description?: string;
    extra?: ReactNode;
}

export default function PageContainer({
    children,
    title,
    description,
    extra
}: PageContainerProps) {
    return (
        <div className="ant-pro-page-container">
            {(title || extra) && (
                <div className="page-header">
                    <div className="page-header-content">
                        {title && (
                            <div className="page-header-heading">
                                <h1 className="page-title">{title}</h1>
                                {description && <p className="page-description">{description}</p>}
                            </div>
                        )}
                    </div>
                    {extra && <div className="page-header-extra">{extra}</div>}
                </div>
            )}
            <div className="page-content">
                {children}
            </div>
        </div>
    );
}
