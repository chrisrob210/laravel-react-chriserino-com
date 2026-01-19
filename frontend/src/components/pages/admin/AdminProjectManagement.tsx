import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Card from "../../common/Card"
import FlexColContainer from "../../common/FlexColContainer"
import Title from "../../common/Title"
import RepoManagementCard from "../../common/RepoManagementCard"
import ConfirmModal from "../../common/ConfirmModal"
import { useApiData } from "../../../hooks/useApiData"
import { apiRequest } from "../../../lib/api"
import { useAuth } from "@clerk/clerk-react"
import { RepoProps } from "../../../lib/definitions"
import { ROUTE_PATHS } from "../../../constants/routePaths"

interface ProjectFromApi {
    id: number;
    title: string;
    category: string;
    description: string;
    uri: string;
    image: string;
    github: string;
    technologies?: Array<{
        id: number;
        title: string;
        url: string;
    }>;
}

export default function AdminProjectManagement() {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { data: projectsData, loading, error, refetch } = useApiData<ProjectFromApi[]>('/projects');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<{ id: number; title: string } | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Transform API projects to match RepoCard format
    const transformedProjects = useMemo<RepoProps[]>(() => {
        if (!projectsData) return [];

        return projectsData.map((project: ProjectFromApi) => ({
            title: project.title,
            category: project.category, // Projects don't have categories in DB, using empty string
            technologies: (project.technologies || []).map((tech: { id: number; title: string; url: string }) => ({
                title: tech.title,
                href: tech.url
            })),
            description: project.description || '',
            href: project.uri || '',
            image: project.image || '',
            github: project.github || ''
        }));
    }, [projectsData]);

    const handleEdit = (id: number) => {
        navigate(`${ROUTE_PATHS.ADMIN_PROJECT_EDIT}/${id}`);
    };

    const handleDeleteClick = (id: number) => {
        const project = projectsData?.find(p => p.id === id);
        if (project) {
            setProjectToDelete({ id: project.id, title: project.title });
            setDeleteModalOpen(true);
            setDeleteError(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!projectToDelete) return;

        try {
            const response = await apiRequest(
                `/projects/${projectToDelete.id}`,
                {
                    method: 'DELETE',
                },
                getToken
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to delete project' }));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            // Refetch the projects list after successful delete
            await refetch();
            setDeleteModalOpen(false);
            setProjectToDelete(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting';
            setDeleteError(errorMessage);
            console.error('Error deleting project:', err);
        }
    };

    return (
        <FlexColContainer>
            <div className="flex justify-between items-center w-full mb-4">
                <div className="text-slate-600 font-semibold p-5">Project Management</div>
                <button
                    onClick={() => navigate(ROUTE_PATHS.ADMIN_PROJECT_CREATE)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Project
                </button>
            </div>
            <Card>
                {loading && <div>Loading projects...</div>}
                {error && (
                    <div className="text-red-500">
                        Error loading projects: {error.message}
                    </div>
                )}
                {deleteError && (
                    <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {deleteError}
                    </div>
                )}
                {!loading && !error && transformedProjects.length === 0 && (
                    <div>No projects found.</div>
                )}
                {!loading && !error && transformedProjects.length > 0 && (
                    <div className="grid grid-cols-1 sm:w-3/4 md:grid-cols-2 gap-4 mx-auto items-stretch">
                        {projectsData?.map((project: ProjectFromApi, repoIndex: number) => {
                            const transformedProject = transformedProjects.find(p => p.title === project.title);
                            if (!transformedProject) return null;

                            return (
                                <RepoManagementCard
                                    key={`project-card-${project.id}`}
                                    repo={transformedProject}
                                    repoIndex={repoIndex}
                                    projectId={project.id}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteClick}
                                />
                            );
                        })}
                    </div>
                )}
            </Card>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setProjectToDelete(null);
                    setDeleteError(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Project"
                message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                confirmButtonColor="bg-red-600 hover:bg-red-700"
            />
        </FlexColContainer>
    )
}
