'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ReactNode, useCallback } from 'react';

interface AdminFiltersProps {
    children: ReactNode;
}

export default function AdminFilters({ children }: AdminFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleFilterChange = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        // We use a form to collect all values at once
        const formData = new FormData(e.currentTarget);
        const params = new URLSearchParams(searchParams.toString());

        // Update params based on form data
        // For selects, we usually want immediate update
        // For text inputs, maybe only on Enter? 
        // But since this is a small CMS, immediate or form submit is fine.

        formData.forEach((value, key) => {
            if (value) {
                params.set(key, value.toString());
            } else {
                params.delete(key);
            }
        });

        // Always reset to page 1 on filter change
        params.set('page', '1');

        router.push(`${pathname}?${params.toString()}`);
    }, [pathname, router, searchParams]);

    return (
        <form
            onChange={handleFilterChange}
            onSubmit={(e) => {
                e.preventDefault();
                handleFilterChange(e as any);
            }}
            className="flex flex-col sm:flex-row gap-4 flex-1"
        >
            {children}
        </form>
    );
}
