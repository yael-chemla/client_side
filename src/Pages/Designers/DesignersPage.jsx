import { useState, useEffect } from "react";
import { createConversation } from "../../API/chat"; // 2. נוסיף את ה-API
import { useNavigate } from "react-router-dom"; // 1. נוסיף את זה
import { getDesigners } from "../../API/users"; // נצטרך לייצא את הפונקציה הזו מ-users.js
import { Link } from "react-router-dom"; // תוסיפי את זה
import "../../CSS/DesignersPage.css";
import Pagination from "../Projects/components/Pagination";
import DesignerCard from "./DesignerCard";
export default function DesignersPage() {
    const [designers, setDesigners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metadata, setMetadata] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchDesigners = async () => {
            setLoading(true);
            try {
                const data = await getDesigners(currentPage);
                setDesigners(data.designers);
                setMetadata(data.metadata);
            } catch (err) {
                setError("משהו השתבש בטעינת המעצבות.");
            } finally {
                setLoading(false);
            }
        };
        fetchDesigners();
    }, [currentPage]);

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
                        <DesignerCard key={d.id} designer={d} />
                    ))}
                </div>
            )}
            <Pagination
                metadata={metadata}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}