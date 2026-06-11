import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../constants";
import { Link } from "react-router-dom";

export default function ProjectHeader({ project, isOwner, onDelete }) {
    const navigate = useNavigate();

    return (
        <header className="project-header">
            <h1>{project.title}</h1>
            {isOwner && (
                <div className="owner-actions">
                    <button onClick={() => navigate(`/edit-project/${project.id}`)}>עדכון פרויקט</button>
                    <button className="delete-btn" onClick={onDelete}>מחיקת פרויקט</button>
                </div>
            )}
            <div className="designer-profile">
                <img
                    src={project.designer_avatar ? `${API_BASE_URL}${project.designer_avatar}` : "/default-avatar.png"}
                    alt="designer"
                    className="designer-avatar"
                    onError={(e) => { e.target.src = "/default-avatar.png"; }}
                />

                {/* <p className="designer-name">מעצבת: {project.designer_name}</p> */}
                <Link to={`/designer/${project.designer_id}`} className="designer-name">
                    מעצבת: {project.designer_name}
                </Link>
            </div>
            <div className="tags">
                <span><strong>חדר:</strong> {project.room_type}</span>
                <span><strong>סגנון:</strong> {project.style}</span>
                <span><strong>תקציב:</strong> {project.budget_range}</span>
            </div>
        </header>
    );
}