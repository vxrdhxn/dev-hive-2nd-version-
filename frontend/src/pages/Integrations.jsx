import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SourceBadge from '../components/SourceBadge';

export default function Integrations() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await getStats();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    const sources = [
        { name: 'github', count: stats?.sources?.github || 0 },
        { name: 'notion', count: stats?.sources?.notion || 0 },
        { name: 'slack', count: stats?.sources?.slack || 0 },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Integrations Status</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {sources.map((source) => (
                        <li key={source.name} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <SourceBadge source={source.name} />
                                    <p className="ml-4 text-sm font-medium text-gray-900">
                                        {source.count} documents indexed
                                    </p>
                                </div>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <p className="mt-4 text-sm text-gray-500">
                Integration management is currently read-only. Configure integrations via environment variables.
            </p>
        </div>
    );
}
