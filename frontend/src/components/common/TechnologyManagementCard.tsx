import { Link } from "react-router-dom";

interface Technology {
    id: number;
    title: string;
    url: string;
    category: string | null;
    icon: string | null;
}

interface TechnologyManagementCardProps {
    technology: Technology;
    technologyIndex: number;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TechnologyManagementCard({
    technology,
    technologyIndex,
    onEdit,
    onDelete
}: TechnologyManagementCardProps) {
    return (
        <div
            key={`technology-${technologyIndex}`}
            className="relative flex flex-col justify-between gap-3 w-auto px-6 py-4 border-[1px] rounded-lg border-white/20 shadow-md shadow-gray-500/50 bg-white/40 backdrop-blur-sm h-full min-h-[200px]"
        >
            {/* Admin Action Icons - Top Right Corner */}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
                <button
                    onClick={() => onEdit(technology.id)}
                    className="p-1.5 rounded-md bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all"
                    title="Edit technology"
                    aria-label="Edit technology"
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
                    onClick={() => onDelete(technology.id)}
                    className="p-1.5 rounded-md bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all"
                    title="Delete technology"
                    aria-label="Delete technology"
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

            {/* Technology Info */}
            <div className="flex flex-col gap-2 flex-grow">
                <div className="text-lg font-bold text-center">{technology.title}</div>

                {technology.category && (
                    <div className="text-sm font-semibold text-center text-gray-600">
                        Category: <span className="italic">{technology.category}</span>
                    </div>
                )}

                {!technology.category && (
                    <div className="text-sm font-semibold text-center text-gray-400 opacity-50">
                        No category
                    </div>
                )}

                {technology.url && (
                    <div className="text-center">
                        <Link
                            to={technology.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                            Visit Website
                        </Link>
                    </div>
                )}

                {!technology.url && (
                    <div className="text-center text-gray-400 opacity-50 text-sm">
                        No URL
                    </div>
                )}
            </div>

            {/* Icon area - always takes up space */}
            <div className="flex justify-center items-center min-h-[80px] mt-auto">
                {technology.icon ? (
                    <img
                        src={technology.icon}
                        alt={`${technology.title} icon`}
                        className="h-16 w-16 object-contain"
                    />
                ) : (
                    <div className="h-16 w-16 flex items-center justify-center text-gray-300 text-xs">
                        No icon
                    </div>
                )}
            </div>
        </div>
    );
}
