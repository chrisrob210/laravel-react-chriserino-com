import React, { useMemo } from 'react'
import ExperienceCard from '../ExperienceCard'
import RepoCard from '../common/RepoCard'
import { Experience } from '../../lib/definitions'
import { RepoProps } from '../../lib/definitions'
import { usePublicApiData } from '../../hooks/usePublicApiData'

interface ProjectFromApi {
    id: number;
    title: string;
    category: string;
    description: string;
    uri: string;
    image: string;
    github: string;
    show_in_portfolio: boolean;
    technologies?: Array<{
        id: number;
        title: string;
        url: string;
    }>;
}

export default function Portfolio() {
    const avatar = '/images/me.jpg'

    // Use the reusable hook for both endpoints
    const { data: projectsData, loading: projectsLoading, error: projectsError } = usePublicApiData<ProjectFromApi[]>('/projects/portfolio');
    const { data: experienceData, loading: experienceLoading, error: experienceError } = usePublicApiData<Experience[]>('/technologies/by-category');

    // Transform API projects to match RepoCard format
    const transformedProjects = useMemo<RepoProps[]>(() => {
        if (!projectsData) return [];

        return projectsData.map((project: ProjectFromApi) => ({
            title: project.title,
            category: project.category || '',
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
        <div className="flex flex-row justify-center pt-3 min-h-screen bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400  text-slate-800">
            <div className="flex flex-col items-center gap-y-10">
                {/* <h1 className="text-lg font-bold text-center mb-3">Portfolio</h1> */}

                {/* Picture & Info */}
                <div className='flex flex-col gap-4'>
                    <img
                        src={avatar}
                        alt="avatar"
                        width={128}
                        height={128}
                        className='rounded-full' style={{
                            width: "128px",
                            height: 'auto',
                            boxShadow: '0 0 7px rgb(0,0,0,0.2)'
                        }} />
                </div>

                <div>
                    <div className="text-center">
                        <p className="text-2xl font-bold mb-3">Hello! I&apos;m Chris</p>
                    </div>

                    <div className="text-lg font-bold space-y-1 w-full max-w-xl mx-auto px-4">
                        <div className="text-center sm:text-left">Full Stack at heart,</div>
                        <div className="text-center sm:text-right">API-driven by nature.</div>
                    </div>
                </div>

                {/* Experience */}
                <div className="w-full sm:w-3/4">
                    <div className='text-center text-xl font-bold mb-2'>Experience</div>
                    {experienceLoading && (
                        <div className="text-center">Loading experience...</div>
                    )}
                    {experienceError && (
                        <div className="text-center text-red-500">
                            Error loading experience: {experienceError.message}
                        </div>
                    )}
                    {!experienceLoading && !experienceError && experienceData && experienceData.length > 0 && (
                        <div className={`grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
                            {experienceData.map((exp: Experience, expIndex: number) => (
                                <ExperienceCard key={`experience-card-${expIndex}`} experience={exp} />
                            ))}
                        </div>
                    )}
                    {!experienceLoading && !experienceError && (!experienceData || experienceData.length === 0) && (
                        <div className="text-center">No experience data found.</div>
                    )}
                </div>


                {/* Git Repos */}
                {projectsLoading && (
                    <div className="text-center">Loading projects...</div>
                )}
                {projectsError && (
                    <div className="text-center text-red-500">
                        Error loading projects: {projectsError.message}
                    </div>
                )}
                {!projectsLoading && !projectsError && transformedProjects.length === 0 && (
                    <div className="text-center">No projects found.</div>
                )}
                {!projectsLoading && !projectsError && transformedProjects.length > 0 && (
                    <div className="grid grid-cols-1  sm:w-3/4 md:grid-cols-2 gap-4 mx-auto items-stretch">
                        {transformedProjects.map((project: RepoProps, repoIndex: number) => (
                            <RepoCard key={`repo-card-${repoIndex}`} repo={project} repoIndex={repoIndex} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
