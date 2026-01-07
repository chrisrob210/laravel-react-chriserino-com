import React from 'react'

interface CardProps {
    children?: React.ReactNode;
    className?: string;
    title?: string;
}

export default function Card({ children, className = '', title }: CardProps) {
    return (
        <div className='flex flex-col justify-center items-center gap-3 w-auto px-6 py-4 border-[1px] rounded-lg border-white/20 shadow-md shadow-gray-500/50 bg-white/40 backdrop-blur-sm h-full'>
            {title &&
                <div className='text-xs font-bold text-center px-1 py-[0.1rem] rounded text-red-600'>{title}</div>
            }
            {children}
        </div>
    )
}
