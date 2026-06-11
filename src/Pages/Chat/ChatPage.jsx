import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInbox, deleteConversation } from "../../API/chat";
import { SocketContext } from "../../Hooks/SocketContext";
import { useAuth } from "../../Hooks/UserContext";
import { API_BASE_URL } from "../../constants";
import ChatWindow from "./components/ChatWindow";
import "../../CSS/chat.css";

export default function ChatPage() {
    const { conversationId } = useParams();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const { user } = useAuth();

    const getImageUrl = (path) => {
        if (!path) return "/default-avatar.png";
        if (path.startsWith("http")) return path;
        return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
    };

    useEffect(() => {
        const fetchInbox = async () => {
            try {
                const data = await getInbox();
                setConversations(data);
            } catch (err) {
                console.error("שגיאה בטעינת תיבת ההודעות:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInbox();
    }, []);

    useEffect(() => {
        if (!socket || !user) return;
        socket.emit("join_user_room", user.id);

        const handleConversationDeleted = ({ conversationId }) => {
            setConversations((prev) =>
                prev.filter((conv) => conv.conversation_id !== conversationId)
            );
        };

        socket.on("conversation_deleted", handleConversationDeleted);
        return () => socket.off("conversation_deleted", handleConversationDeleted);
    }, [socket, user]);

    const handleDelete = async (e, convId) => {
        e.stopPropagation();
        if (!window.confirm("האם למחוק את השיחה?")) return;
        try {
            await deleteConversation(convId);
            if (conversationId === String(convId)) navigate("/inbox");
        } catch (err) {
            alert("שגיאה במחיקת השיחה");
        }
    };

    const activeConversation = conversations.find(
        (c) => String(c.conversation_id) === String(conversationId)
    );

    if (loading) return <div className="loading">טוען...</div>;

    return (
        <div className="chat-page">
            {/* עמודה שמאלית — רשימת שיחות */}
            <aside className="conversations-sidebar">
                <h2>הודעות</h2>
                {conversations.map((conv) => (
                    <div
                        key={conv.conversation_id}
                        className={`conv-item ${String(conv.conversation_id) === String(conversationId) ? "active" : ""}`}
                        onClick={() => navigate(`/inbox/${conv.conversation_id}`)}
                    >
                        <img
                            src={getImageUrl(conv.other_user_image)}
                            alt={conv.other_user_name}
                            className="conv-avatar"
                            onError={(e) => { e.target.src = "/default-avatar.png"; }}
                        />
                        <div className="conv-details">
                            <p className="conv-name">{conv.other_user_name}</p>
                            <p className="conv-last-msg">{conv.last_message || "אין הודעות"}</p>
                        </div>
                        <button
                            className="delete-conv-btn"
                            onClick={(e) => handleDelete(e, conv.conversation_id)}
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </aside>

            {/* פאנל ימני — הצ'אט */}
            <main className="chat-main">
                {conversationId ? (
                    <ChatWindow
                        conversationId={conversationId}
                        otherUser={activeConversation}
                    />
                ) : (
                    <div className="no-chat-selected">
                        <p>בחר שיחה כדי להתחיל</p>
                    </div>
                )}
            </main>
        </div>
    );
}