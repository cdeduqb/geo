'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    const searchParams = useSearchParams();

    // Create a helper to build URLs with existing search params
    const buttonClass = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-gray-100 hover:text-gray-900 h-9 rounded-md px-3";

    // Create a helper to build URLs with existing search params
    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center space-x-2 py-4">
            {currentPage <= 1 ? (
                <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    上一页
                </Button>
            ) : (
                <Link
                    href={createPageUrl(currentPage - 1)}
                    className={buttonClass}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    上一页
                </Link>
            )}

            <div className="flex items-center gap-1 text-sm font-medium">
                <span className="px-2">
                    {currentPage} / {totalPages}
                </span>
            </div>

            {currentPage >= totalPages ? (
                <Button variant="outline" size="sm" disabled>
                    下一页
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            ) : (
                <Link
                    href={createPageUrl(currentPage + 1)}
                    className={buttonClass}
                >
                    下一页
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            )}
        </div>
    );
}
