import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInbox } from "../../API/chat"; // נשתמש ב-API שיצרנו
import "../../CSS/InboxPage.css"; // כאן הוספנו את הקישור ל-CSS
export default function InboxPage() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    if (loading) return <div>טוען הודעות...</div>;

    // return (
    //     <div className="inbox-container">
    //         <h2>הודעות</h2>
    //         {conversations.length === 0 ? (
    //             <p>אין לך שיחות פעילות.</p>
    //         ) : (
    //             conversations.map((chat) => (
    //                 <div 
    //                     key={chat.conversation_id} 
    //                     className="chat-item"
    //                     onClick={() => navigate(`/chat/${chat.conversation_id}`)}
    //                 >
    //                     <img src={chat.other_user_image || "/default-avatar.png"} alt="avatar" />
    //                     <div className="chat-info">
    //                         <h4>{chat.other_user_name}</h4>
    //                         <p>{chat.last_message || "אין הודעות עדיין..."}</p>
    //                     </div>
    //                 </div>
    //             ))
    //         )}
    //     </div>
    // );
    // ב-InboxPage.jsx
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
                            {/* הוספתי תמונה כי זה חלק מהעיצוב שרצית */}
                            <img
                                src={conv.other_user_image
                                    ? `http://localhost:3000${conv.other_user_image}`
                                    : "/default-avatar.png"
                                }
                                alt={conv.other_user_name || "user"}
                                className="conv-avatar"
                                onError={(e) => { e.target.src = "/default-avatar.png"; }}
                            />                            <div className="conv-details">
                                <p><strong>{conv.other_user_name}</strong></p>
                                <p>{conv.last_message || "אין הודעות"}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}