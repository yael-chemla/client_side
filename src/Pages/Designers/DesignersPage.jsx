import { useState, useEffect } from "react";
import { getDesigners } from "../../API/users"; // נצטרך לייצא את הפונקציה הזו מ-users.js
import { Link } from "react-router-dom"; // תוסיפי את זה
import "../../CSS/DesignersPage.css";

export default function DesignersPage() {
    const [designers, setDesigners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                            <a href={`/chat?designerId=${d.id}`} className="chat-btn">
                                שלח הודעה
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}