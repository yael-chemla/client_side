import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getInbox, deleteConversation } from "../../API/chat"; // נשתמש ב-API שיצרנו
import "../../CSS/InboxPage.css"; // כאן הוספנו את הקישור ל-CSS
import { SocketContext } from "../../Hooks/SocketContext";
import { useAuth } from "../../Hooks/UserContext";

export default function InboxPage() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const { user } = useAuth();

    // ✅ תיקון תמונה — ממירה נתיב יחסי ל-URL מלא
    const getImageUrl = (path) => {
        if (!path) return "/default-avatar.png";
        if (path.startsWith("http")) return path; // כבר URL מלא
        return `http://localhost:3000/${path.replace(/^\//, "")}`;
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

    // ✅ הצטרפות לחדר האישי + האזנה למחיקת שיחה בזמן אמת
    useEffect(() => {
        if (!socket || !user) return;

        socket.emit("join_user_room", user.id);

        const handleConversationDeleted = ({ conversationId }) => {
            setConversations((prev) =>
                prev.filter((conv) => conv.conversation_id !== conversationId)
            );
        };

        socket.on("conversation_deleted", handleConversationDeleted);

        return () => {
            socket.off("conversation_deleted", handleConversationDeleted);
        };
    }, [socket, user]);

    const handleDelete = async (e, conversationId) => {
        e.stopPropagation(); // ✅ מונע ניווט לשיחה בלחיצה על המחיקה

        // ✅ אישור לפני מחיקה
        const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק את השיחה?");
        if (!confirmed) return;

        try {
            await deleteConversation(conversationId);
            // לא צריך לעדכן state — ה-socket יטפל בזה
        } catch (err) {
            alert("שגיאה במחיקת השיחה");
        }
    };

    if (loading) return <div>טוען הודעות...</div>;


    return (
        <div className="inbox-wrapper"> {/* שונה מ-inbox-container */}
            <div className="conversations-sidebar"> {/* שונה מ-conversations-list */}
                <h2>הודעות</h2>
                {conversations.map((conv, index) => {
                    console.log("נתיב תמונה שהתקבל:", conv.other_user_image);
                    const conversationId = conv.conversation_id;
                    return (
                        <div
                            key={conv.conversation_id || index}
                            className="conv-item" // שונה מ-conversation-item
                            onClick={() => navigate(`/chat/${conversationId}`)}
                        >
                            <img
                                src={getImageUrl(conv.other_user_image)} // ✅ תיקון תמונה
                                alt={conv.other_user_name}
                                className="conv-avatar"
                                onError={(e) => { e.target.src = "/default-avatar.png"; }}
                            />
                            <div className="conv-details">
                                <p><strong>{conv.other_user_name}</strong></p>
                                <p>{conv.last_message || "אין הודעות"}</p>
                            </div>
                            <button
                                className="delete-conv-btn"
                                onClick={(e) => handleDelete(e, conversationId)}
                                title="מחק שיחה"
                            >
                                🗑️
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}