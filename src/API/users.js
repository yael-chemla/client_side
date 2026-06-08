import { api } from "./api";

// שליפת פרופיל אישי (דורש טוקן)
export const getMyProfile = () => api.get("/users/profile");

// עדכון פרופיל (תומך גם בתמונה - FormData)
export const updateMyProfile = (formData) => api.put("/users/profile", formData, true);

// שליפת פרופיל מעצבת ציבורי (לא דורש טוקן)
export const getDesignerProfile = (id) => api.get(`/users/designer/${id}`);

// שליפת רשימת כל המעצבות
export const getDesigners = () => api.get("/users/designers");