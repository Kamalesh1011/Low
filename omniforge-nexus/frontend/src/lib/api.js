/**
 * OmniForge Nexus — API Client
 * 
 * In development: uses Vite proxy (/api/v1/...)
 * In production:  uses VITE_API_URL env var pointing to Render backend
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Make an API request with automatic base URL resolution.
 * @param {string} path - API path starting with /api/v1/...
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(path, options = {}) {
    const url = `${BASE_URL}${path}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Add auth token if available
    try {
        const stored = localStorage.getItem('omniforge-store');
        if (stored) {
            const parsed = JSON.parse(stored);
            const token = parsed?.state?.user?.token;
            if (token) {
                defaultHeaders['Authorization'] = `Bearer ${token}`;
            }
        }
    } catch (e) {
        // ignore
    }

    return fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });
}

/**
 * Helper for GET requests
 */
export async function apiGet(path) {
    const res = await apiFetch(path);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

/**
 * Helper for POST requests
 */
export async function apiPost(path, body) {
    const res = await apiFetch(path, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

export default { apiFetch, apiGet, apiPost, BASE_URL };
