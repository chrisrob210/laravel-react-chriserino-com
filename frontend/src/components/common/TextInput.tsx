import React from 'react'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

/**
 * Generic TextInput component with optional label, error message, and helper text
 * 
 * @param label - Optional label text above the input
 * @param error - Optional error message to display below the input
 * @param helperText - Optional helper text to display below the input
 * @param fullWidth - If true, input takes full width of container
 * @param ...rest - All standard HTML input attributes (value, onChange, placeholder, type, etc.)
 */
export default function TextInput({
    label,
    error,
    helperText,
    fullWidth = false,
    className = '',
    ...rest
}: TextInputProps) {
    const inputId = rest.id || `input-${Math.random().toString(36).slice(2, 11)}`;
    const hasError = !!error;

    const baseInputClasses = `
        px-4 py-2 
        border rounded-lg 
        bg-white/40 backdrop-blur-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        transition-colors
        ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-white/20'}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={baseInputClasses}
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
