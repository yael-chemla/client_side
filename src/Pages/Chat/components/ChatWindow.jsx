import { useEffect, useState, useContext } from "react";
import { getMessages, sendMessage, deleteMessage } from "../../../API/chat";
import { useAuth } from "../../../Hooks/UserContext";
import { SocketContext } from "../../../Hooks/SocketContext";
import { API_BASE_URL } from "../../../constants";
import Message from "./Message";

export default function ChatWindow({ conversationId, otherUser }) {
    const { user } = useAuth();
    const socket = useContext(SocketContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (!conversationId) return;
        const load = async () => {
            try {
                const data = await getMessages(conversationId);
                setMessages(data);
            } catch (err) {
                console.error("שגיאה בטעינת הודעות:", err);
            }
        };
        load();
    }, [conversationId]);

    useEffect(() => {
        if (!socket) return;
        socket.emit("join_chat", conversationId);

        const handleReceiveMessage = (msg) => setMessages((prev) => [...prev, msg]);
        const handleMessageUpdated = (updatedMsg) =>
            setMessages((prev) => prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m)));
        const handleMessageDeleted = ({ messageId }) =>
            setMessages((prev) => prev.filter((m) => m.id !== messageId));

        socket.on("receive_message", handleReceiveMessage);
        socket.on("message_updated", handleMessageUpdated);
        socket.on("message_deleted", handleMessageDeleted);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("message_updated", handleMessageUpdated);
            socket.off("message_deleted", handleMessageDeleted);
        };
    }, [socket, conversationId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            await sendMessage(conversationId, newMessage);
            setNewMessage("");
        } catch (err) {
            alert("שגיאה בשליחת הודעה");
        }
    };

    return (
        <div className="chat-window">
            {/* כותרת עם שם ותמונה */}
            {otherUser && (
                <div className="chat-header">
                    <img
                        src={otherUser.other_user_image
                            ? `${API_BASE_URL}/${otherUser.other_user_image.replace(/^\//, "")}`
                            : "/default-avatar.png"}
                        alt={otherUser.other_user_name}
                        className="chat-avatar"
                        onError={(e) => { e.target.src = "/default-avatar.png"; }}
                    />
                    <h3>{otherUser.other_user_name}</h3>
                </div>
            )}

            <div className="messages-list">
                {messages.map((msg) => (
                    <Message
                        key={msg.id}
                        msg={msg}
                        user={user}
                        onDelete={async (id) => await deleteMessage(id)}
                        onEdit={(updatedMsg) =>
                            setMessages(messages.map((m) => m.id === updatedMsg.id ? updatedMsg : m))
                        }
                    />
                ))}
            </div>

            <form className="chat-form" onSubmit={handleSend}>
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="כתוב הודעה..."
                />
                <button type="submit">שלח</button>
            </form>
        </div>
    );
}
