import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, deleteProject } from "../../API/projects";
import { useAuth } from "../../Hooks/UserContext";
import { createConversation } from "../../API/chat";
import ProjectHeader from "./projectDetails/ProjectHeader";
import ProjectGallery from "./projectDetails/ProjectGallery";
import ProjectDescription from "./projectDetails/ProjectDescription";

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const isOwner = isAuthenticated && user && project && (user.id === project.designer_id);

    useEffect(() => {
        const loadProject = async () => {
            try {
                const data = await getProjectById(id);
                setProject(data);
            } catch (err) {
                alert("שגיאה בטעינת הפרויקט");
                navigate("/projects"); // הגיוני לחזור אחורה אם הפרויקט לא נטען
            }
        };
        loadProject();
    }, [id]);

    if (!project) return <div className="loading">טוען פרטי פרויקט...</div>;

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

    const handleChat = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            const conversation = await createConversation(project.designer_id);
            navigate(`/inbox/${conversation.conversationId}`);  // ← תיקון כאן
        } catch (err) {
            alert("לא ניתן היה לפתוח שיחה כרגע");
        }
    };

    return (
        <div className="project-details-container">
            <ProjectHeader
                project={project}
                isOwner={isOwner}
                onDelete={handleDelete}
            />
            <ProjectGallery
                images={project.images}
                projectTitle={project.title}
            />
            <ProjectDescription
                description={project.description}
                isOwner={isOwner}
                isAuthenticated={isAuthenticated}
                onChat={handleChat}
            />
        </div>
    );
}