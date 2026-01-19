import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Card from "../../common/Card"
import FlexColContainer from "../../common/FlexColContainer"
import Title from "../../common/Title"
import TechnologyManagementCard from "../../common/TechnologyManagementCard"
import ConfirmModal from "../../common/ConfirmModal"
import { useApiData } from "../../../hooks/useApiData"
import { apiRequest } from "../../../lib/api"
import { useAuth } from "@clerk/clerk-react"
import { ROUTE_PATHS } from "../../../constants/routePaths"

interface TechnologyFromApi {
    id: number;
    title: string;
    url: string;
    category: string | null;
    icon: string | null;
}

export default function AdminTechnologyManagement() {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { data: technologiesData, loading, error, refetch } = useApiData<TechnologyFromApi[]>('/technologies');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [technologyToDelete, setTechnologyToDelete] = useState<{ id: number; title: string } | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleEdit = (id: number) => {
        navigate(`${ROUTE_PATHS.ADMIN_TECHNOLOGY_EDIT}/${id}`);
    };

    const handleDeleteClick = (id: number) => {
        const technology = technologiesData?.find(t => t.id === id);
        if (technology) {
            setTechnologyToDelete({ id: technology.id, title: technology.title });
            setDeleteModalOpen(true);
            setDeleteError(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!technologyToDelete) return;

        try {
            const response = await apiRequest(
                `/technologies/${technologyToDelete.id}`,
                {
                    method: 'DELETE',
                },
                getToken
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to delete technology' }));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            // Refetch the technologies list after successful delete
            await refetch();
            setDeleteModalOpen(false);
            setTechnologyToDelete(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting';
            setDeleteError(errorMessage);
            console.error('Error deleting technology:', err);
        }
    };

    return (
        <FlexColContainer>
            <div className="flex justify-between items-center w-full mb-4">
                <div className="text-slate-600 font-semibold p-5">Technology Management</div>
                <button
                    onClick={() => navigate(ROUTE_PATHS.ADMIN_TECHNOLOGY_CREATE)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Technology
                </button>
            </div>
            <Card>
                {loading && <div>Loading technologies...</div>}
                {error && (
                    <div className="text-red-500">
                        Error loading technologies: {error.message}
                    </div>
                )}
                {deleteError && (
                    <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {deleteError}
                    </div>
                )}
                {!loading && !error && (!technologiesData || technologiesData.length === 0) && (
                    <div>No technologies found.</div>
                )}
                {!loading && !error && technologiesData && technologiesData.length > 0 && (
                    <div className="grid grid-cols-1 sm:w-3/4 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto items-stretch">
                        {technologiesData.map((technology: TechnologyFromApi, technologyIndex: number) => (
                            <TechnologyManagementCard
                                key={`technology-card-${technology.id}`}
                                technology={technology}
                                technologyIndex={technologyIndex}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                )}
            </Card>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setTechnologyToDelete(null);
                    setDeleteError(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Technology"
                message={`Are you sure you want to delete "${technologyToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                confirmButtonColor="bg-red-600 hover:bg-red-700"
            />
        </FlexColContainer>
    )
}
