import React from 'react';

const sourceColors = {
    github: 'bg-gray-800 text-white',
    notion: 'bg-white text-gray-800 border border-gray-200',
    slack: 'bg-purple-600 text-white',
};

const sourceLabels = {
    github: 'GitHub',
    notion: 'Notion',
    slack: 'Slack',
};

export default function SourceBadge({ source }) {
    const normalizedSource = source?.toLowerCase();
    const colorClass = sourceColors[normalizedSource] || 'bg-gray-200 text-gray-800';
    const label = sourceLabels[normalizedSource] || source;

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
            {label}
        </span>
    );
}
