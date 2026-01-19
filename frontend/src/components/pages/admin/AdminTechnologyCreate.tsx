import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../common/Card";
import FlexColContainer from "../../common/FlexColContainer";
import Title from "../../common/Title";
import TextInput from "../../common/TextInput";
import { apiRequest } from "../../../lib/api";
import { useAuth } from "@clerk/clerk-react";

export default function AdminTechnologyCreate() {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        category: '',
        icon: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaveError(null);

        try {
            const response = await apiRequest(
                '/technologies',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        category: formData.category || null,
                        icon: formData.icon || null,
                        url: formData.url || null
                    })
                },
                getToken
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to create technology' }));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            // Navigate back to technology management on success
            navigate('/admin/tech-management');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while saving';
            setSaveError(errorMessage);
            console.error('Error creating technology:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FlexColContainer>
            <Title title="Create Technology" />
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                    {saveError && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {saveError}
                        </div>
                    )}

                    <TextInput
                        label="Title *"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextInput
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="e.g., Frontend, Backend, Database"
                        fullWidth
                    />

                    <TextInput
                        label="URL"
                        name="url"
                        type="text"
                        value={formData.url}
                        onChange={handleChange}
                        placeholder="https://example.com or /path/to/resource"
                        fullWidth
                    />

                    <TextInput
                        label="Icon URL"
                        name="icon"
                        type="text"
                        value={formData.icon}
                        onChange={handleChange}
                        placeholder="/images/icons/icon.png or https://example.com/icon.png"
                        fullWidth
                        helperText="Path or URL to the technology icon/image"
                    />

                    {/* Preview Icon */}
                    {formData.icon && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Icon Preview</label>
                            <div className="flex justify-center p-4 border rounded-lg bg-gray-50">
                                <img
                                    src={formData.icon}
                                    alt={`${formData.title} icon`}
                                    className="h-16 w-16 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Technology'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/tech-management')}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Card>
        </FlexColContainer>
    );
}
