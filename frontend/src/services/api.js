const API_BASE_URL = ''; // Proxied by Vite

// Fetch system statistics
async function getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }
    return response.json();
}

// Perform semantic search
async function search(query) {
    const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
    }
    return response.json();
}

// Ask AI-powered question
async function ask(question) {
    const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
    });
    if (!response.ok) {
        throw new Error(`Ask failed: ${response.statusText}`);
    }
    return response.json();
}

export { getStats, search, ask };
