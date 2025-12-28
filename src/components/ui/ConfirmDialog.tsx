'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonClass?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = '确认',
    cancelText = '取消',
    confirmButtonClass = 'bg-blue-600 hover:bg-blue-700',
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-[480px] p-6 gap-0 overflow-hidden">
                <div className="flex gap-4">
                    <div className="shrink-0">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <DialogHeader className="text-left p-0 space-y-2">
                            <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
                            <DialogDescription className="text-sm text-gray-500 whitespace-pre-line">
                                {message}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>
                <DialogFooter className="mt-6 gap-3 sm:gap-0">
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={confirmButtonClass}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
