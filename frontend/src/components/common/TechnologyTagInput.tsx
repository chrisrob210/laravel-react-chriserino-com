import { useState, useEffect, useRef } from "react";
import { usePublicApiData } from "../../hooks/usePublicApiData";

interface Technology {
    id: number;
    title: string;
    url: string;
}

interface TechnologyTagInputProps {
    selectedTechnologies: Technology[];
    onChange: (technologies: Technology[]) => void;
    label?: string;
    error?: string;
    helperText?: string;
}

export default function TechnologyTagInput({
    selectedTechnologies,
    onChange,
    label,
    error,
    helperText
}: TechnologyTagInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [allTechnologies, setAllTechnologies] = useState<Technology[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Fetch all technologies with their real IDs
    const { data: technologiesData } = usePublicApiData<Technology[]>('/technologies');

    useEffect(() => {
        if (technologiesData) {
            // Technologies come with real IDs from the database
            setAllTechnologies(technologiesData);
        }
    }, [technologiesData]);

    // Filter suggestions based on input
    const filteredSuggestions = allTechnologies.filter(
        (tech) =>
            tech.title.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedTechnologies.find((selected) => selected.title === tech.title)
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setShowSuggestions(value.length > 0);
    };

    const handleAddTechnology = (technology: Technology) => {
        // Check if already selected
        if (!selectedTechnologies.find((t) => t.title === technology.title)) {
            onChange([...selectedTechnologies, technology]);
        }
        setInputValue("");
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleRemoveTechnology = (technologyToRemove: Technology) => {
        onChange(selectedTechnologies.filter((t) => t.title !== technologyToRemove.title));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() && filteredSuggestions.length > 0) {
            e.preventDefault();
            handleAddTechnology(filteredSuggestions[0]);
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const hasError = !!error;

    return (
        <div className="relative z-10 flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-2 min-h-[2.5rem] p-2 border rounded-lg bg-white/40 backdrop-blur-sm border-white/20">
                {selectedTechnologies.map((tech) => (
                    <span
                        key={tech.title}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm border border-blue-300"
                    >
                        {tech.title}
                        <button
                            type="button"
                            onClick={() => handleRemoveTechnology(tech)}
                            className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                            aria-label={`Remove ${tech.title}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </span>
                ))}

                {/* Input */}
                <div className="relative flex-1 min-w-[150px]">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(inputValue.length > 0)}
                        placeholder={selectedTechnologies.length === 0 ? "Add technologies..." : ""}
                        className={`
                            w-full px-2 py-1 
                            border-0 rounded 
                            bg-transparent
                            focus:outline-none focus:ring-0
                            ${hasError ? 'text-red-500 placeholder-red-300' : ''}
                        `}
                    />

                    {/* Suggestions Dropdown */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div
                            ref={suggestionsRef}
                            className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                        >
                            {filteredSuggestions.map((tech) => (
                                <button
                                    key={tech.title}
                                    type="button"
                                    onClick={() => handleAddTechnology(tech)}
                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                                >
                                    {tech.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <span className="text-sm text-red-500">
                    {error}
                </span>
            )}
            {helperText && !error && (
                <span className="text-sm text-gray-500">
                    {helperText}
                </span>
            )}
        </div>
    );
}
