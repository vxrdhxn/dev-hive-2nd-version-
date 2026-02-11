import React, { useState } from 'react';
import { ask } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SourceBadge from '../components/SourceBadge';

export default function Ask() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setError(null);
        setAnswer(null);
        setSources([]);

        try {
            const data = await ask(question);
            setAnswer(data.answer);
            setSources(data.sources || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Ask AI</h1>

            <form onSubmit={handleAsk} className="mb-8">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a question about your knowledge base..."
                        className="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                    <button
                        type="submit"
                        disabled={loading || !question.trim()}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Asking...' : 'Ask'}
                    </button>
                </div>
            </form>

            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}

            {answer && (
                <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Answer</h3>
                        <div className="prose max-w-none text-gray-700">
                            <p className="whitespace-pre-wrap">{answer}</p>
                        </div>

                        {sources.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-500 mb-3">Sources Used</h4>
                                <ul className="space-y-3">
                                    {sources.map((source, index) => (
                                        <li key={index} className="bg-gray-50 rounded p-3">
                                            <div className="flex items-center mb-1">
                                                <SourceBadge source={source.source} />
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">{source.text}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
