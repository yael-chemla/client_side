import { api } from "./api"; 

export const getInbox = () => api.get("/conversations/inbox");

export const getMessages = (conversationId) => api.get(`/messages/${conversationId}`);

export const sendMessage = (conversationId, message_text) => 
    api.post(`/messages/${conversationId}`, { message_text });

export const createConversation = async (receiverId) => {
    return await api.post("/conversations", { receiver_id: receiverId });
};

export const editMessage = (messageId, message_text) => 
    api.put(`/messages/${messageId}`, { message_text });

export const deleteMessage = (messageId) => 
    api.delete(`/messages/${messageId}`);

export const deleteConversation = (conversationId) =>
    api.delete(`/conversations/${conversationId}`);