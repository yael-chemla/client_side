import { useState } from "react";
import { editMessage, deleteMessage } from "../../../API/chat";

export default function Message({ msg, user, onDelete, onEdit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(msg.message_text);

    const handleEdit = async () => {
        try {
            const updated = await editMessage(msg.id, editText);
            onEdit(updated);
            setIsEditing(false);
        } catch (err) {
            alert("שגיאה בעריכת ההודעה");
        }
    };

    return (
        <div className={`msg-wrapper ${msg.sender_id === user.id ? "my-msg" : "other-msg"}`}>
            {isEditing ? (
                <div className="edit-mode">
                    <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                    <button onClick={handleEdit}>שמור</button>
                    <button onClick={() => setIsEditing(false)}>ביטול</button>
                </div>
            ) : (
                <div className="msg-content">
                    <p>{msg.message_text}</p>
                    {/* איקונים שמופיעים רק לשולח ההודעה */}
                    {msg.sender_id === user.id && (
                        <div className="msg-actions">
                            <span onClick={() => setIsEditing(true)}>✏️</span>
                            <span onClick={() => onDelete(msg.id)}>🗑️</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}