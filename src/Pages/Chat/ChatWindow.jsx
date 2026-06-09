// import { useEffect, useState,useContext } from "react";
// import { useParams } from "react-router-dom";
// import { getMessages, sendMessage } from "../../API/chat";
// import { useAuth } from "../../Hooks/UserContext";
// import { SocketContext } from "../../Hooks/SocketContext"; // הייבוא החדשexport default function ChatWindow() {

// export default function ChatWindow() {
// const { conversationId } = useParams(); // ה-ID מה-URL
// const { user } = useAuth(); // כדי לדעת מי השולח
// const socket = useContext(SocketContext); // שימוש ב-Socket
// const [messages, setMessages] = useState([]);
// const [newMessage, setNewMessage] = useState("");
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//     loadMessages();
//     if (socket) {
//         socket.emit("join_chat", conversationId);
//         socket.on("receive_message", (msg) => {
//             setMessages((prev) => [...prev, msg]);
//         });
//     }
//     return () => socket && socket.off("receive_message");
// }, [socket, conversationId]);

// const loadMessages = async () => {
//     try {
//         const data = await getMessages(conversationId);
//         setMessages(data);
//     } catch (err) {
//         console.error("שגיאה בטעינת הודעות:", err);
//     } finally {
//         setLoading(false);
//     }
// };

// const handleSend = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     try {
//         const sent = await sendMessage(conversationId, newMessage);
//         setMessages([...messages, sent]); // הוספת ההודעה החדשה לתצוגה
//         setNewMessage(""); // ניקוי שדה הקלט
//     } catch (err) {
//         alert("שגיאה בשליחת הודעה");
//     }
// };

// if (loading) return <div>טוען שיחה...</div>;

// return (
//     <div className="chat-window">
//         <div className="messages-list">
//             {messages.map((msg) => (
//                 <div key={msg.id} className={msg.sender_id === user.id ? "my-msg" : "other-msg"}>
//                     <p>{msg.message_text}</p>
//                 </div>
//             ))}
//         </div>
//         <form onSubmit={handleSend}>
//             <input
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="כתוב הודעה..."
//             />
//             <button type="submit">שלח</button>
//         </form>
//     </div>
// );
// }

// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { getMessages, sendMessage } from "../../API/chat";
// import { useAuth } from "../../Hooks/UserContext";
// import { SocketContext } from "../../Hooks/SocketContext";

// export default function ChatWindow() {
//     const { conversationId } = useParams();
//     const { user } = useAuth();
//     const socket = useContext(SocketContext);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadMessages();
//         if (socket) {
//             socket.emit("join_chat", conversationId);
//             socket.on("receive_message", (msg) => {
//                 // נוודא שההודעה שייכת לשיחה הזו לפני שמוסיפים
//                 setMessages((prev) => [...prev, msg]);
//             });
//         }
//         return () => socket && socket.off("receive_message");
//     }, [socket, conversationId]);

//     const loadMessages = async () => {
//         try {
//             const data = await getMessages(conversationId);
//             setMessages(data);
//         } catch (err) {
//             console.error("שגיאה בטעינת הודעות:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSend = async (e) => {
//         e.preventDefault();
//         if (!newMessage.trim()) return;
//         try {
//             await sendMessage(conversationId, newMessage);
//             setNewMessage("");
//         } catch (err) {
//             alert("שגיאה בשליחת הודעה");
//         }
//     };

//     if (loading) return <div>טוען שיחה...</div>;

//     return (
//         <div className="chat-container">
//             <div className="messages-list">
//                 {messages.map((msg) => (
//                     <div key={msg.id} className={`msg ${msg.sender_id === user.id ? "my-msg" : "other-msg"}`}>
//                         <p>{msg.message_text}</p>
//                     </div>
//                 ))}
//             </div>
//             <form className="chat-form" onSubmit={handleSend}>
//                 <input
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="כתוב הודעה..."
//                 />
//                 <button type="submit">שלח</button>
//             </form>
//         </div>
//     );
// }

import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getMessages, sendMessage } from "../../API/chat";
import { useAuth } from "../../Hooks/UserContext";
import { SocketContext } from "../../Hooks/SocketContext";
import "../../CSS/chat.css"
import Message from "./components/Message";

export default function ChatWindow() {
    const { conversationId } = useParams();
    const { user } = useAuth();
    const socket = useContext(SocketContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        // הגנה: אל תעשה כלום אם ה-ID לא קיים (מונע את ה-undefined)
        if (!conversationId) return;

        const loadInitialMessages = async () => {
            try {
                const data = await getMessages(conversationId);
                setMessages(data);
            } catch (err) {
                console.error("שגיאה בטעינת הודעות:", err);
            }
        };
        loadInitialMessages();
    }, [conversationId]);
    // 2. האזנה ל-Socket (כאן הקסם קורה!)
    useEffect(() => {
        if (!socket) return;

        socket.emit("join_chat", conversationId);

        const handleReceiveMessage = (msg) => {
            // הוספת הודעה חדשה לרשימה הקיימת בלי לרענן
            setMessages((prevMessages) => [...prevMessages, msg]);
        };

        // הוספנו האזנה לעריכה:
        const handleMessageUpdated = (updatedMsg) => {
            setMessages((prev) =>
                prev.map((msg) => (msg.id === updatedMsg.id ? updatedMsg : msg))
            );
        };
        socket.on("receive_message", handleReceiveMessage);
        socket.on("message_updated", handleMessageUpdated); // <-- כאן

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("message_updated", handleMessageUpdated); // <-- וגם כאן
        };
    }, [socket, conversationId]);

    // 3. שליחת הודעה
    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessage(conversationId, newMessage);
            setNewMessage(""); // מנקה את השדה, ה-Socket יביא את ההודעה חזרה
        } catch (err) {
            alert("שגיאה בשליחת הודעה");
        }
    };

    return (
        <div className="chat-window">
            <div className="messages-list">
                {messages.map((msg) => (
                    <Message
                        key={msg.id}
                        msg={msg}
                        user={user}
                        onDelete={async (id) => {
                            await deleteMessage(id);
                            setMessages(messages.filter(m => m.id !== id));
                        }}
                        onEdit={(updatedMsg) => {
                            setMessages(messages.map(m => m.id === updatedMsg.id ? updatedMsg : m));
                        }}
                    />
                ))}
            </div>
            <form onSubmit={handleSend}>
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