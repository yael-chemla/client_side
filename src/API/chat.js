import { api } from "./api"; // ה-api שכתבת קודם

// שליפת רשימת השיחות (ה-Inbox)
export const getInbox = () => api.get("/conversations/inbox");

// שליפת הודעות בשיחה ספציפית
export const getMessages = (conversationId) => api.get(`/messages/${conversationId}`);

// שליחת הודעה
export const sendMessage = (conversationId, message_text) => 
    api.post(`/messages/${conversationId}`, { message_text });

// src/API/chat.js
export const createConversation = async (receiverId) => {
    // השתמשתי ב-api.post כפי שהגדרת ב-api.js
    return await api.post("/conversations", { receiver_id: receiverId });
};

// נוסיף לקובץ src/API/chat.js
export const editMessage = (messageId, message_text) => 
    api.put(`/messages/${messageId}`, { message_text });

export const deleteMessage = (messageId) => 
    api.delete(`/messages/${messageId}`);

// ✅ חדש — מחיקת שיחה שלמה
export const deleteConversation = (conversationId) =>
    api.delete(`/conversations/${conversationId}`);