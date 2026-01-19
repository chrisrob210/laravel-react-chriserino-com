import { useMemo } from "react"
import Card from "../../common/Card"
import FlexColContainer from "../../common/FlexColContainer"
import Title from "../../common/Title"
import RepoCard from "../../common/RepoCard"
import { useApiData } from "../../../hooks/useApiData"
import { RepoProps } from "../../../lib/definitions"

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
                        {transformedProjects.map((project: RepoProps, repoIndex: number) => (
                            <RepoCard key={`project-card-${repoIndex}`} repo={project} repoIndex={repoIndex} />
                        ))}
                    </div>
                )}
            </Card>
        </FlexColContainer>
    )
}
