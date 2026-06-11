// import { API_BASE_URL } from "../constants";

// // async function request(url, options = {}) {
// //     const token = localStorage.getItem("token");
// //     console.log("Sending Request to:", url, "With Token:", token); // <-- תוסיפי את זה
// //     const headers = {
// //         ...(options.isFormData ? {} : { "Content-Type": "application/json" }),
// //         ...(token ? { "Authorization": `Bearer ${token}` } : {}),
// //         ...options.headers,
// //     };

// //     const { isFormData, ...fetchOptions } = options;

// //     const res = await fetch(`${API_BASE}${url}`, {
// //         ...fetchOptions,
// //         headers,
// //     });

// //     if (!res.ok) {
// //         const errorData = await res.json().catch(() => ({ message: "API Error" }));
// //         throw new Error(errorData.message || "API Error");
// //     }

// //     if (res.status === 204) return true;
// //     return res.json();
// // }

// async function request(url, options = {}) {
//     const token = localStorage.getItem("token");
//     const headers = {
//         ...(options.isFormData ? {} : { "Content-Type": "application/json" }),
//         ...(token ? { "Authorization": `Bearer ${token}` } : {}),
//         ...options.headers,
//     };

//     const { isFormData, ...fetchOptions } = options;
    
//     const res = await fetch(`${API_BASE}${url}`, {
//         ...fetchOptions,
//         headers,
//     });

//     // קראנו את התשובה פעם אחת בלבד כדי למנוע שגיאות
//     const data = await res.json().catch(() => ({}));

//     if (!res.ok) {
//         throw new Error(data.message || "API Error");
//     }

//     return data; 
// }

// export const api = {
//     get: (url) => request(url),
//     // ב-api.js
//     post: (url, data, isFormData = false) => request(url, {
//         method: "POST",
//         isFormData: isFormData, // מעבירים את זה ל-request
//         body: isFormData ? data : JSON.stringify(data),
//     }),
//     put: (url, data, isFormData = false) =>
//         request(url, {
//             method: "PUT",
//             body: isFormData ? data : JSON.stringify(data),
//             isFormData: isFormData, // הוספנו את זה!
//             headers: isFormData ? {} : { "Content-Type": "application/json" }
//         }),
//     delete: (url) => request(url, { method: "DELETE" }),
// };
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