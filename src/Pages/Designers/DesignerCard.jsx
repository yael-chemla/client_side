import { Link, useNavigate } from "react-router-dom";
import { createConversation } from "../../API/chat";
import { API_BASE_URL } from "../../constants";

export default function DesignerCard({ designer }) {
    const navigate = useNavigate();
    const d = designer;

    const handleChat = async () => {
        try {
            const response = await createConversation(parseInt(d.id));
            if (response?.conversationId) {
                navigate(`/inbox/${response.conversationId}`);;
            }
        } catch (err) {
            alert("לא ניתן היה לפתוח שיחה.");
        }
    };

    const handleProjects = () => {
        navigate(`/projects?designer_id=${d.id}`);
    };

    return (
        <div className="designer-card">
            <img
                src={
                    d.profile_image
                        ? (d.profile_image.startsWith("http") ? d.profile_image : `${API_BASE_URL}${d.profile_image}`
                        )
                        : "/default-avatar.png"
                }
                alt={d.full_name}
                className="designer-img"
            />
            <Link to={`/designer/${d.id}`}>
                <h3>{d.full_name}</h3>
            </Link>
            <p>📍 {d.city}</p>
            <div className="designer-card-actions">
                <button className="chat-btn" onClick={handleChat}>
                    שלח הודעה
                </button>
                <button className="projects-btn" onClick={handleProjects}>
                    הפרויקטים שלי
                </button>
            </div>
        </div>
    );
}