import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../common/Card";
import FlexColContainer from "../../common/FlexColContainer";
import Title from "../../common/Title";
import TextInput from "../../common/TextInput";
import Textarea from "../../common/Textarea";
import TechnologyTagInput from "../../common/TechnologyTagInput";
import { useApiData } from "../../../hooks/useApiData";
import { apiRequest } from "../../../lib/api";
import { useAuth } from "@clerk/clerk-react";

interface Technology {
    id: number;
    title: string;
    url: string;
}

interface ProjectFromApi {
    id: number;
    title: string;
    category: string;
    description: string;
    uri: string;
    image: string;
    github: string;
    show_in_portfolio: boolean;
    technologies?: Technology[];
}

export default function AdminProjectEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Fetch project data
    const { data: projectData, loading: fetchLoading, error: fetchError } = useApiData<ProjectFromApi>(`/projects/${id}`);

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

    // Technologies state (separate since backend doesn't handle it yet)
    const [selectedTechnologies, setSelectedTechnologies] = useState<Technology[]>([]);

    // Populate form when project data loads
    useEffect(() => {
        if (projectData) {
            setFormData({
                title: projectData.title || '',
                category: projectData.category || '',
                description: projectData.description || '',
                uri: projectData.uri || '',
                image: projectData.image || '',
                github: projectData.github || '',
                show_in_portfolio: projectData.show_in_portfolio || false
            });
            // Set technologies from project data (these have real IDs from the database)
            setSelectedTechnologies(projectData.technologies || []);
        }
    }, [projectData]);

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
            // Include technologies in the request (backend won't process it yet, but we're ready)
            const requestData = {
                ...formData,
                technologies: selectedTechnologies.map(tech => tech.id)
            };

            const response = await apiRequest(
                `/projects/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData)
                },
                getToken
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to update project' }));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            // Navigate back to project management on success
            navigate('/admin/project-management');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while saving';
            setSaveError(errorMessage);
            console.error('Error updating project:', err);
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <FlexColContainer>
                <Title title="Edit Project" />
                <Card>
                    <div>Loading project...</div>
                </Card>
            </FlexColContainer>
        );
    }

    if (fetchError || !projectData) {
        return (
            <FlexColContainer>
                <Title title="Edit Project" />
                <Card>
                    <div className="text-red-500">
                        {fetchError?.message || 'Project not found'}
                    </div>
                    <button
                        onClick={() => navigate('/admin/project-management')}
                        className="mt-4 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-400"
                    >
                        Back to Project Management
                    </button>
                </Card>
            </FlexColContainer>
        );
    }

    return (
        <FlexColContainer>
            <Title title="Edit Project" />
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

                    <TextInput
                        label="Image URL"
                        name="image"
                        type="text"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="/images/project.png or https://example.com/image.png"
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
                            {loading ? 'Saving...' : 'Save Changes'}
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
