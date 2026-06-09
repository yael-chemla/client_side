import { useState, useEffect } from "react";
import { createConversation } from "../../API/chat"; // 2. נוסיף את ה-API
import { useNavigate } from "react-router-dom"; // 1. נוסיף את זה
import { getDesigners } from "../../API/users"; // נצטרך לייצא את הפונקציה הזו מ-users.js
import { Link } from "react-router-dom"; // תוסיפי את זה
import "../../CSS/DesignersPage.css";

export default function DesignersPage() {
    const [designers, setDesigners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // <-- השורה הזו חסרה לך!

    useEffect(() => {
        const fetchDesigners = async () => {
            try {
                const data = await getDesigners();
                setDesigners(data);
            } catch (err) {
                setError("משהו השתבש בטעינת המעצבות. נסי שוב מאוחר יותר.");
            } finally {
                setLoading(false);
            }
        };
        fetchDesigners();
    }, []);

    if (loading) return <div className="loading">טוען מעצבות...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="designers-container">
            <h2>המעצבות שלנו</h2>
            {designers.length === 0 ? (
                <p>לא נמצאו מעצבות כרגע.</p>
            ) : (
                <div className="designers-grid">
                    {designers.map((d) => (
                        // ... בתוך ה-map של המעצבות:
                        <div key={d.id} className="designer-card">
                            <img
                                src={
                                    d.profile_image
                                        ? (d.profile_image.startsWith("http") ? d.profile_image : `http://localhost:3000${d.profile_image}`)
                                        : "/default-avatar.png"
                                }
                                alt={d.full_name}
                                className="designer-img"
                            />
                            <Link to={`/designer/${d.id}`}>
                                <h3>{d.full_name}</h3>
                            </Link>
                            <p>📍 {d.city}</p>
                            <button
                                className="chat-btn"
                                onClick={async () => {
                                    try {
                                        // נבטיח שה-ID הוא מספר לפני השליחה
                                        const designerId = parseInt(d.id);
                                        console.log("מנסה ליצור שיחה עם מעצבת ID:", designerId);

                                        const response = await createConversation(designerId);

                                        if (response && response.conversationId) {
                                            console.log("מנווט ל-:", `/chat/${response.conversationId}`);
                                            navigate(`/chat/${response.conversationId}`);
                                        }
                                    } catch (err) {
                                        console.error("שגיאה ב-DesignersPage:", err);
                                        alert("לא ניתן היה לפתוח שיחה.");
                                    }
                                }}
                            >
                                שלח הודעה
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}