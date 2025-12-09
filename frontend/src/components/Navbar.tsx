import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { routes } from '../constants/routes'

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="bg-white shadow-lg p-0 m-0">
            <div className="flex justify-between items-center py-4 px-3">
                <div className="text-xl font-bold">Chriserino.com</div>
                <div className="flex space-x-4">
                    {routes
                        .filter(route => route.label) // Only show routes with labels
                        .map(route => (
                            <Link
                                key={route.path}
                                to={route.path}
                                className={`px-3 py-2 rounded ${location.pathname === route.path
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {route.label}
                            </Link>
                        ))}
                </div>
            </div>
        </nav>
    )
}
