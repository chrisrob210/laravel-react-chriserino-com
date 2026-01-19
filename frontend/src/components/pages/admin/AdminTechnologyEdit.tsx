import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../common/Card";
import FlexColContainer from "../../common/FlexColContainer";
import Title from "../../common/Title";
import TextInput from "../../common/TextInput";
import { useApiData } from "../../../hooks/useApiData";
import { apiRequest } from "../../../lib/api";
import { useAuth } from "@clerk/clerk-react";

interface TechnologyFromApi {
    id: number;
    title: string;
    url: string;
    category: string | null;
    icon: string | null;
}

export default function AdminTechnologyEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Fetch technology data
    const { data: technologyData, loading: fetchLoading, error: fetchError } = useApiData<TechnologyFromApi>(`/technologies/${id}`);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        category: '',
        icon: ''
    });

    // Populate form when technology data loads
    useEffect(() => {
        if (technologyData) {
            setFormData({
                title: technologyData.title || '',
                url: technologyData.url || '',
                category: technologyData.category || '',
                icon: technologyData.icon || ''
            });
        }
    }, [technologyData]);

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
                `/technologies/${id}`,
                {
                    method: 'PUT',
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
                const errorData = await response.json().catch(() => ({ message: 'Failed to update technology' }));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            // Navigate back to technology management on success
            navigate('/admin/tech-management');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while saving';
            setSaveError(errorMessage);
            console.error('Error updating technology:', err);
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <FlexColContainer>
                <Title title="Edit Technology" />
                <Card>
                    <div>Loading technology...</div>
                </Card>
            </FlexColContainer>
        );
    }

    if (fetchError || !technologyData) {
        return (
            <FlexColContainer>
                <Title title="Edit Technology" />
                <Card>
                    <div className="text-red-500">
                        {fetchError?.message || 'Technology not found'}
                    </div>
                    <button
                        onClick={() => navigate('/admin/tech-management')}
                        className="mt-4 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-400"
                    >
                        Back to Technology Management
                    </button>
                </Card>
            </FlexColContainer>
        );
    }

    return (
        <FlexColContainer>
            <Title title="Edit Technology" />
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
                            {loading ? 'Saving...' : 'Save Changes'}
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
