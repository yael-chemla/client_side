import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, deleteProject } from "../../API/projects";
import { useAuth } from "../../Hooks/UserContext";
import { createConversation } from "../../API/chat"; // תוודאי שזה הנתיב הנכון

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth(); // וודאי ש-user כולל את ה-ID של המשתמש המחובר

    // בדיקה האם המשתמש המחובר הוא הבעלים של הפרויקט
    const isOwner = isAuthenticated && user && project && (user.id === project.designer_id);

    const handleDelete = async () => {
        if (window.confirm("האם למחוק את הפרויקט לצמיתות?")) {
            try {
                await deleteProject(id);
                alert("הפרויקט נמחק");
                navigate("/projects");
            } catch (err) {
                alert("שגיאה במחיקה: " + err.message);
            }
        }
    };

    useEffect(() => {
        // שליפת הפרויקט מהשרת (שימי לב: הפונקציה הזו צריכה להחזיר את כל המידע)
        const loadProject = async () => {
            const data = await getProjectById(id);
            setProject(data);
        };
        loadProject();
    }, [id]);

    if (!project) return <div className="loading">טוען פרטי פרויקט...</div>;
    const handleChat = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            // פתיחת/יצירת שיחה עם המעצב/ת של הפרויקט
            const conversation = await createConversation(project.designer_id);
            // ניווט לשיחה עם ה-ID שחזר
            navigate(`/chat/${conversation.conversationId}`);
        } catch (err) {
            console.error("שגיאה בפתיחת שיחה:", err);
            alert("לא ניתן היה לפתוח שיחה כרגע");
        }
    };

    return (
        <div className="project-details-container">
            {/* כותרת ופרטים */}
            <header className="project-header">
                <h1>{project.title}</h1>
                {/* כפתורי עריכה ומחיקה - מופיעים רק לבעלים */}
                {isOwner && (
                    <div className="owner-actions">
                        <button onClick={() => navigate(`/edit-project/${id}`)}>עדכון פרויקט</button>
                        <button className="delete-btn" onClick={handleDelete}>מחיקת פרויקט</button>
                    </div>
                )}
                <div className="designer-profile">
                    <img
                        src={project.designer_avatar ? `http://localhost:3000${project.designer_avatar}` : "/default-avatar.png"}
                        alt="designer"
                        className="designer-avatar"
                        onError={(e) => { e.target.src = "/default-avatar.png"; }}
                    />                    <p className="designer-name">מעצבת: {project.designer_name}</p>
                </div>

                <div className="tags">
                    <span><strong>חדר:</strong> {project.room_type}</span>
                    <span><strong>סגנון:</strong> {project.style}</span>
                    <span><strong>תקציב:</strong> {project.budget_range}</span>
                </div>
            </header>

            {/* גלריית תמונות */}
            <section className="project-gallery">
                {project.images && project.images.map((img, i) => (
                    <div key={i} className="image-wrapper">
                        <img src={`http://localhost:3000${img.image_url}`} alt={project.title} />
                        <div className={img.is_before ? "label-before" : "label-after"}>
                            {img.is_before ? "לפני השיפוץ" : "אחרי השיפוץ"}
                        </div>
                    </div>
                ))}
            </section>

            {/* תיאור וכפתור צ'אט (מופיע פעם אחת!) */}
            <article className="project-description">
                <h3>על הפרויקט</h3>
                <p>{project.description}</p>

                <div className="chat-container">
                    <button
                        className="chat-btn"
                        onClick={handleChat}
                    >
                        {isAuthenticated ? "צ'אט עם המעצבת" : "התחבר כדי לשוחח עם המעצבת"}
                    </button>
                </div>
            </article>
        </div>
    );
}