import { api } from './api';

export const getProjectById = async (id) => {
    return await api.get(`/projects/${id}`);
};
export const getProjects = async (filters = {}) => {

    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
    const query = new URLSearchParams(cleanFilters).toString();
    return await api.get(`/projects?${query}`);
};

export const createProject = async (data) => {
    return await api.post('/projects', data);
};

export const updateProject = async (id, data) => {
    return await api.put(`/projects/${id}`, data);
};

export const deleteProject = async (id) => {
    return await api.delete(`/projects/${id}`);
};

export const getMyProjects = () => api.get("/projects/my-projects");

export const getProjectsByDesigner = async (designerId) => {
    return await api.get(`/projects?designer_id=${designerId}`);
};