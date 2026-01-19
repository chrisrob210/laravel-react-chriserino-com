import React from 'react'

export interface TitleProps {
    title: string
}

export default function Title({ title }: TitleProps) {
    return (
        <div className="text-slate-600 font-semibold w-fit mx-auto p-5">{title}</div>
    )
}
