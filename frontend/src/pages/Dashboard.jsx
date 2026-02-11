import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
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
    if (!stats) return <ErrorMessage message="No data available" />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard title="Total Vectors" value={stats.total_vectors} />
                <StatCard title="Total Documents" value={stats.total_documents} />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Source Breakdown</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <StatCard title="GitHub Documents" value={stats.sources?.github || 0} />
                <StatCard title="Notion Documents" value={stats.sources?.notion || 0} />
                <StatCard title="Slack Documents" value={stats.sources?.slack || 0} />
            </div>
        </div>
    );
}
