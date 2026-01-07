import React from 'react'

interface CardProps {
    children?: React.ReactNode;
    className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
    return (
        <div className='flex flex-col justify-between gap-3 w-auto px-6 py-4 border-[1px] rounded-lg border-white/20 shadow-md shadow-gray-500/50 bg-white/40 backdrop-blur-sm h-full'>
            {children}
        </div>
    )
}
