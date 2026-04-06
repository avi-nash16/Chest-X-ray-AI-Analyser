const BASE_URL = 'http://localhost:8080/api';

const api = {
    get: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`);
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    post: async (endpoint, data, isFormData = false) => {
        const options = {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data),
        };
        if (!isFormData) {
            options.headers = { 'Content-Type': 'application/json' };
        }
        const res = await fetch(`${BASE_URL}${endpoint}`, options);
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    put: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, { method: 'PUT' });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }
};

export default api;