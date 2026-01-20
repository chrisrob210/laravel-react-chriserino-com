import Modal from "./Modal";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: string;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmButtonColor = "bg-red-600 hover:bg-red-700"
}: ConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            showCloseButton={true}
        >
            <div className="space-y-4">
                <p className="text-gray-700">{message}</p>
                <div className="flex gap-3 justify-end pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 ${confirmButtonColor} text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
