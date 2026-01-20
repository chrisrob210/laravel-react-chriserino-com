import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../common/Card";
import FlexColContainer from "../../common/FlexColContainer";
import Title from "../../common/Title";
import TextInput from "../../common/TextInput";
import Textarea from "../../common/Textarea";
import TechnologyTagInput from "../../common/TechnologyTagInput";
import ImageUpload from "../../common/ImageUpload";
import { apiRequest } from "../../../lib/api";
import { useAuth } from "@clerk/clerk-react";

interface Technology {
    id: number;
    title: string;
    url: string;
}

export default function AdminProjectCreate() {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        uri: '',
        image: '',
        github: '',
        show_in_portfolio: false
    });

    // Technologies state
    const [selectedTechnologies, setSelectedTechnologies] = useState<Technology[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaveError(null);

        try {
            // Include technologies in the request
            const requestData = {
                ...formData,
                technologies: selectedTechnologies.map(tech => tech.id)
            };

            const response = await apiRequest(
                '/projects',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData)
                },
                getToken
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to create project' }));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            // Navigate back to project management on success
            navigate('/admin/project-management');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while saving';
            setSaveError(errorMessage);
            console.error('Error creating project:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FlexColContainer>
            <Title title="Create Project" />
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
                        label="Category *"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <Textarea
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        fullWidth
                    />

                    <TechnologyTagInput
                        label="Technologies"
                        selectedTechnologies={selectedTechnologies}
                        onChange={setSelectedTechnologies}
                        helperText="Add technologies used in this project"
                    />

                    <TextInput
                        label="Project URI"
                        name="uri"
                        type="url"
                        value={formData.uri}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        fullWidth
                    />

                    <ImageUpload
                        label="Project Image"
                        value={formData.image}
                        onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                        helperText="Upload an image or enter a URL"
                        fullWidth
                    />

                    <TextInput
                        label="GitHub URL"
                        name="github"
                        type="url"
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="https://github.com/username/repo"
                        fullWidth
                    />

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="show_in_portfolio"
                            name="show_in_portfolio"
                            checked={formData.show_in_portfolio}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="show_in_portfolio" className="text-sm font-medium text-gray-700">
                            Show in Portfolio
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/project-management')}
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
