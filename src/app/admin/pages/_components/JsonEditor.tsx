'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface JsonEditorProps {
    value: any;
    onChange: (value: any) => void;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ value, onChange }) => {
    // Initialize with formatted JSON
    const [stringValue, setStringValue] = useState(() => {
        try {
            return value === undefined ? '' : JSON.stringify(value, null, 2);
        } catch (e) {
            return '';
        }
    });
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(true);

    // Track the last valid value we parsed/emitted to avoid loop updates
    const lastParsedValueRef = useRef<string>(JSON.stringify(value));

    // Sync from props if the prop value has changed externally (and is different from what we last emitted)
    useEffect(() => {
        const currentPropString = JSON.stringify(value);
        if (currentPropString !== lastParsedValueRef.current) {
            setStringValue(value === undefined ? '' : JSON.stringify(value, null, 2));
            lastParsedValueRef.current = currentPropString || '';
            setError(null);
            setIsValid(true);
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setStringValue(newValue);

        try {
            const parsed = JSON.parse(newValue);
            setError(null);
            setIsValid(true);

            // Only notify parent if the value is actually different to avoid unnecessary re-renders
            if (JSON.stringify(parsed) !== lastParsedValueRef.current) {
                lastParsedValueRef.current = JSON.stringify(parsed);
                onChange(parsed);
            }
        } catch (err: any) {
            setError(err.message);
            setIsValid(false);
            // Do not call onChange with invalid JSON
        }
    };

    return (
        <div className="space-y-2">
            <div className={`flex items-center gap-2 text-xs p-2 rounded border ${isValid
                ? 'text-green-600 bg-green-50 border-green-100'
                : 'text-red-600 bg-red-50 border-red-100'
                }`}>
                {isValid ? (
                    <>
                        <Check className="w-3 h-3" />
                        <span>格式正确</span>
                    </>
                ) : (
                    <>
                        <AlertCircle className="w-3 h-3" />
                        <span>{error || '无效的 JSON 格式'}</span>
                    </>
                )}
            </div>
            <textarea
                value={stringValue}
                onChange={handleChange}
                rows={12}
                className={`w-full rounded-md border px-2 py-1.5 text-xs font-mono transition-colors focus:outline-none focus:ring-2 ${isValid
                        ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white'
                        : 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/10'
                    }`}
                spellCheck={false}
            />
            <div className="text-[10px] text-gray-400">
                支持实时编辑，格式正确时自动保存
            </div>
        </div>
    );
};
