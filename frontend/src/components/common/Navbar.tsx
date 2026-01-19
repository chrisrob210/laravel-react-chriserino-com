import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { routes } from '../../constants/routes'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react'
import { useAdmin } from '../../hooks/useAdmin'

export default function Navbar() {
    const location = useLocation();
    const { isSignedIn } = useUser();
    const isAdmin = useAdmin();
    return (
        <nav className="bg-white shadow-lg p-0 m-0">
            <div className="relative flex items-center justify-between py-4 px-3">
                <div className='pl-3'>
                    <img
                        src="/c-logo32.png"
                        alt="Chriserino.com"
                    />
                </div>
                <div className="flex space-x-4">
                    {routes
                        .filter(route => route.label) // Only show routes with labels
                        .filter(route => route.showInNavbar === true)
                        .filter(route => {
                            // If route is protected (admin), only show if user is admin
                            // Otherwise, show the route
                            return route.protected ? isAdmin : true;
                        })
                        .map(route => (
                            <Link
                                key={route.path}
                                to={route.path}
                                className={`px-3 py-2 rounded ${location.pathname === route.path
                                    ? 'bg-slate-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {route.label}
                            </Link>
                        ))}
                </div>
                <div className='pr-3 flex justify-center items-center'>
                    {isAdmin && (
                        <span className="text-[0.5rem] bg-red-600 text-white px-1 py-[0.1rem] mr-1 rounded">
                            Admin
                        </span>
                    )}
                    {!isSignedIn && <SignInButton />}
                    {isSignedIn && <UserButton />}
                </div>
            </div>
        </nav>
    )
}
