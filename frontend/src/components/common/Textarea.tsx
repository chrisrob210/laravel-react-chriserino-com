import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

/**
 * Generic Textarea component with optional label, error message, and helper text
 * 
 * @param label - Optional label text above the textarea
 * @param error - Optional error message to display below the textarea
 * @param helperText - Optional helper text to display below the textarea
 * @param fullWidth - If true, textarea takes full width of container
 * @param ...rest - All standard HTML textarea attributes (value, onChange, placeholder, rows, etc.)
 */
export default function Textarea({
    label,
    error,
    helperText,
    fullWidth = false,
    className = '',
    ...rest
}: TextareaProps) {
    const textareaId = rest.id || `textarea-${Math.random().toString(36).slice(2, 11)}`;
    const hasError = !!error;

    const baseTextareaClasses = `
        px-4 py-2 
        border rounded-lg 
        bg-white/40 backdrop-blur-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        transition-colors
        resize-y
        ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-white/20'}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label
                    htmlFor={textareaId}
                    className="text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={baseTextareaClasses}
                {...rest}
            />
            {error && (
                <span className="text-sm text-red-500">
                    {error}
                </span>
            )}
            {helperText && !error && (
                <span className="text-sm text-gray-500">
                    {helperText}
                </span>
            )}
        </div>
    );
}
