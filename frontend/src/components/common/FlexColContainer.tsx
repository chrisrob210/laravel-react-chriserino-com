import React from 'react'

interface FlexColContainerProps {
    children?: React.ReactNode;
    className?: string;
}

export default function FlexColContainer({ children, className = '' }: FlexColContainerProps) {
    return (
        <div className="flex-col justify-center items-center min-h-screen p-4 w-[75%] mx-auto">
            {children}
        </div>
    )
}
