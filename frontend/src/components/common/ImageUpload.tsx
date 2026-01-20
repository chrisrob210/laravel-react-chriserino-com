import { useState, useRef } from "react";
import TextInput from "./TextInput";
import { useAuth } from "@clerk/clerk-react";
import { getSanctumToken } from "../../lib/api";
import ConfirmModal from "./ConfirmModal";

interface ImageUploadProps {
    label?: string;
    value: string;
    onChange: (url: string) => void;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    uploadEndpoint?: string;
}

export default function ImageUpload({
    label,
    value,
    onChange,
    error,
    helperText,
    fullWidth = false,
    uploadEndpoint = '/projects/upload-image'
}: ImageUploadProps) {
    const { getToken } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select an image file');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setUploadError('Image must be less than 2MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        setUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            // Get Sanctum token for authentication
            const sanctumToken = await getSanctumToken(getToken);
            const headers: HeadersInit = {};
            if (sanctumToken) {
                headers['Authorization'] = `Bearer ${sanctumToken}`;
            }
            // Don't set Content-Type for FormData - browser will set it with boundary

            const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
            const response = await fetch(`${API_BASE_URL}${uploadEndpoint}`, {
                method: 'POST',
                headers,
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
                throw new Error(errorData.message || 'Upload failed');
            }

            const data = await response.json();

            // Validate response data
            if (!data || !data.url) {
                throw new Error('Invalid response: missing image URL');
            }

            onChange(data.url);
            setPreview(null); // Clear preview to show the uploaded image URL
            setUploadError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
            setUploadError(errorMessage);
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const hasError = !!error || !!uploadError;
    const displayError = error || uploadError;

    return (
        <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}



            {/* File Input */}
            <div className="flex gap-2 items-center">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className={`
                        flex-1 px-4 py-2 
                        border rounded-lg 
                        bg-white/40 backdrop-blur-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                        transition-colors
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-white/20'}
                        ${fullWidth ? 'w-full' : 'w-auto'}
                        ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                />
                {uploading && (
                    <div className="flex items-center px-4 text-sm text-gray-600 whitespace-nowrap">
                        Uploading...
                    </div>
                )}
            </div>

            {/* URL Input (fallback) */}
            {/* <TextInput
                label="Or enter image URL"
                name="image_url_fallback"
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setUploadError(null);
                }}
                placeholder="/images/project.png or https://example.com/image.png"
                fullWidth
                error={displayError ?? undefined}
                helperText={helperText && !displayError ? helperText : undefined}
            /> */}

            {/* Preview or Current Image */}
            {(preview || value) && (
                <div className="relative w-full max-w-md mx-auto">
                    <img
                        src={preview || value}
                        alt="Preview"
                        className="w-full h-48 object-contain border rounded-lg bg-gray-50"
                        onError={() => {
                            // Hide broken images
                            setPreview(null);
                        }}
                    />
                    {value && !preview && (
                        <button
                            type="button"
                            onClick={() => setShowRemoveConfirm(true)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                            title="Remove image"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {displayError && (
                <span className="text-sm text-red-500">
                    {displayError}
                </span>
            )}

            <ConfirmModal
                isOpen={showRemoveConfirm}
                onClose={() => setShowRemoveConfirm(false)}
                onConfirm={handleRemove}
                title="Remove Image"
                message="Are you sure you want to remove this image? This action cannot be undone."
                confirmText="Remove"
                cancelText="Cancel"
                confirmButtonColor="bg-red-600 hover:bg-red-700"
            />
        </div>
    );
}
