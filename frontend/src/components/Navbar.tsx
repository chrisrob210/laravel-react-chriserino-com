import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { routes } from '../constants/routes'

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="bg-white shadow-lg p-0 m-0">
            <div className="relative flex items-center justify-center py-4 px-3">
                {/* <div className="absolute left-3 text-xl font-bold">Chriserino.com</div> */}
                <div className="absolute left-3">
                    <img
                        src="/c-logo32.png"
                        alt="Chriserino.com"
                    />
                </div>
                <div className="flex space-x-4">
                    {routes
                        .filter(route => route.label) // Only show routes with labels
                        .filter(route => route.showInNavbar === true)
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
