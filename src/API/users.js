import { api } from "./api";

export const getMyProfile = () => api.get("/users/profile");

export const updateMyProfile = (formData) => api.put("/users/profile", formData, true);

export const getDesignerProfile = (id) => api.get(`/users/designer/${id}`);

export const getDesigners = (page = 1) => api.get(`/users/designers?page=${page}`);