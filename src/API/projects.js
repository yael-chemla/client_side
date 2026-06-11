import { api } from './api';

// שליפת פרויקט בודד (לדף פרטי הפרויקט)
export const getProjectById = async (id) => {
    return await api.get(`/projects/${id}`);
};
export const getProjects = async (filters = {}) => {
    // מנקים ערכים ריקים כדי לא לשלוח לשם שרת דברים מיותרים
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
    const query = new URLSearchParams(cleanFilters).toString();
    return await api.get(`/projects?${query}`);
};

// יצירת פרויקט (דורש טוקן)
export const createProject = async (data) => {
    return await api.post('/projects', data);
};

// עדכון פרויקט
export const updateProject = async (id, data) => {
    return await api.put(`/projects/${id}`, data);
};

//מחיקת פרוייקט
export const deleteProject = async (id) => {
    return await api.delete(`/projects/${id}`);
};

// שליפת הפרויקטים של המעצבת המחוברת
export const getMyProjects = () => api.get("/projects/my-projects");
//פרויטים לפי שם מעצבת
export const getProjectsByDesigner = async (designerId) => {
    return await api.get(`/projects?designer_id=${designerId}`);
};