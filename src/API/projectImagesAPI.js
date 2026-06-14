import { api } from './api';

export const uploadProjectImage = async (data, isFormData = true) => {
    return await api.post('/project-images', data, isFormData);
};

export const deleteImage = async (imageId) => {
    return await api.delete(`/project-images/${imageId}`);
};

export const updateImage = async (id, isBefore, roomType) => {
    return await api.put(`/project-images/${id}`, { 
        is_before: isBefore,
        room_type: roomType
    });
};