import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    title?: string;
    extra?: ReactNode;
    className?: string;
}

export default function Card({ children, title, extra, className = '' }: CardProps) {
    return (
        <div className={`ant-pro-card ${className}`}>
            {(title || extra) && (
                <div className="card-header">
                    {title && <h3 className="card-title">{title}</h3>}
                    {extra && <div className="card-extra">{extra}</div>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}
