import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const navItems = [
        { name: 'Dashboard', path: '/' },
        { name: 'Search', path: '/search' },
        { name: 'Ask', path: '/ask' },
        { name: 'Integrations', path: '/integrations' },
    ];

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl text-indigo-600">KTP</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
