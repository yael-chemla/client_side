import { api } from './api';

// תוסיפי את זה לקובץ projects.js הקיים שלך
export const uploadProjectImage = async (data, isFormData = true) => {
    return await api.post('/project-images', data, isFormData);
};

//מחיקת תמונה מפרוייקט
export const deleteImage = async (imageId) => {
    return await api.delete(`/project-images/${imageId}`);
};

// עדכון תמונה (שינוי סטטוס)
export const updateImage = async (id, isBefore) => {
    return await api.put(`/project-images/${id}`, { is_before: isBefore });
};