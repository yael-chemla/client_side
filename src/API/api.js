import { API_BASE_URL } from "../constants";

async function request(url, options = {}) {
    const token = localStorage.getItem("token");
    
    const { isFormData, ...fetchOptions } = options;
    
    const headers = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_BASE_URL}${url}`, {
        ...fetchOptions,
        headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.message || "API Error");
    }

    return data;
}

export const api = {
    get: (url) => request(url),
    
    post: (url, data, isFormData = false) => request(url, {
        method: "POST",
        isFormData,
        body: isFormData ? data : JSON.stringify(data),
    }),
    
    put: (url, data, isFormData = false) => request(url, {
        method: "PUT",
        isFormData,
        body: isFormData ? data : JSON.stringify(data),
    }),
    
    delete: (url) => request(url, { method: "DELETE" }),
};