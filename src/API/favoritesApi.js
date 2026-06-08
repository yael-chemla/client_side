import { api } from "./api";

export const getFavorites = async () => {
    return await api.get("/favorites");
};

export const addToFavorites = async (projectId) => {
    return await api.post("/favorites", { project_id: projectId });
};

export const removeFromFavorites = async (projectId) => {
    return await api.delete(`/favorites/${projectId}`);
};