import { Link } from "react-router-dom";
import { RepoProps } from "../../lib/definitions"

interface RepoManagementCardProps {
    repo: RepoProps;
    repoIndex: number;
    projectId: number;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function RepoManagementCard({
    repo,
    repoIndex,
    projectId,
    onEdit,
    onDelete
}: RepoManagementCardProps) {
    return (
        <div
            key={`repo-${repoIndex}`}
            className="relative flex flex-col justify-between gap-3 w-auto px-6 py-4 border-[1px] rounded-lg border-white/20 shadow-md shadow-gray-500/50 bg-white/40 backdrop-blur-sm h-full"
        >
            {/* Admin Action Icons - Top Right Corner */}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
                <button
                    onClick={() => onEdit(projectId)}
                    className="p-1.5 rounded-md bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all"
                    title="Edit project"
                    aria-label="Edit project"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                </button>
                <button
                    onClick={() => onDelete(projectId)}
                    className="p-1.5 rounded-md bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all"
                    title="Delete project"
                    aria-label="Delete project"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>

            {/* Title + Tech */}
            <div>
                {/* Title + Category*/}
                <div className="flex justify-center">
                    <div className="text-lg font-bold text-center whitespace-nowrap mr-1 sm:mb-0 md:mb-1">{repo.title}</div>
                    <div className="text-lg font-bold text-center whitespace-nowrap sm:mb-0 md:mb-1">(<span className="text-base font-semibold italic">{repo.category}</span>)</div>
                </div>
                {/* Technologies */}
                <div className="text-sm font-semibold flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-center text-center">
                    <ul className="flex flex-wrap sm:justify-start md:justify-center gap-2">
                        {repo?.technologies?.map((tech: any, techIndex: number) => (
                            <li key={`repo-tech-${repoIndex}-${techIndex}`}>
                                <Link
                                    key={`tech-link-${repoIndex}-${techIndex}`}
                                    to={tech?.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-black bg-gray-100 px-2 py-1 rounded-md border border-gray-300 hover:text-sky-700 hover:bg-white whitespace-nowrap"
                                >
                                    {tech.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Image */}
            <div className="flex justify-center">
                <Link to={repo?.href}>
                    <img
                        src={repo.image}
                        alt={repo.title}
                        width={550}
                        height={128}
                        className="object-cover rounded-lg ring-[1px] ring-slate-400/25 shadow-sm"
                    />
                </Link>
            </div>

            {/* Description + Buttons */}
            <div className="flex flex-col justify-between h-full">
                <div className="mb-2">{repo.description}</div>
                <div className={repo?.href !== '' ? "grid grid-cols-2 gap-3 mt-auto" : "flex"}>
                    {repo?.href !== '' && (
                        <Link
                            to={repo?.href}
                            className="flex-1 rounded-md px-2 py-1 text-center whitespace-nowrap text-slate-100 bg-slate-500 hover:bg-slate-400"
                        >
                            View
                        </Link>
                    )}
                    <Link
                        to={repo?.github}
                        className="flex-1 rounded-md px-2 py-1 text-center whitespace-nowrap text-slate-100 bg-slate-500 hover:bg-slate-400"
                    >
                        Github Repo
                    </Link>
                </div>
            </div>
        </div>
    );
}
