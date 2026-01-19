import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import Card from "../../common/Card"
import FlexColContainer from "../../common/FlexColContainer"
import Title from "../../common/Title"
import RepoManagementCard from "../../common/RepoManagementCard"
import { useApiData } from "../../../hooks/useApiData"
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
    const { data: projectsData, loading, error } = useApiData<ProjectFromApi[]>('/projects');

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

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                // TODO: Implement delete API call
                console.log('Delete project:', id);
                // Example: await apiRequest(`/projects/${id}`, { method: 'DELETE' });
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    return (
        <FlexColContainer>
            <Title title="Project Management" />
            <Card>
                {loading && <div>Loading projects...</div>}
                {error && (
                    <div className="text-red-500">
                        Error loading projects: {error.message}
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
                                    onDelete={handleDelete}
                                />
                            );
                        })}
                    </div>
                )}
            </Card>
        </FlexColContainer>
    )
}
