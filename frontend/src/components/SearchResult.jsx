import React from 'react';
import SourceBadge from './SourceBadge';

export default function SearchResult({ snippet, source, score }) {
    return (
        <div className="bg-white shadow sm:rounded-lg mb-4">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                    <SourceBadge source={source} />
                    {score !== undefined && (
                        <span className="text-sm text-gray-500">
                            Score: {score.toFixed(4)}
                        </span>
                    )}
                </div>
                <div className="mt-2 text-sm text-gray-900">
                    <p className="whitespace-pre-wrap">{snippet}</p>
                </div>
            </div>
        </div>
    );
}
