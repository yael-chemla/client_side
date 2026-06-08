import { useNavigate } from "react-router-dom";
import { addToFavorites, removeFromFavorites } from "../../../API/favoritesApi";
import "../../../CSS/projects.css"

export default function ProjectCard({ project, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate();
  
  const imageUrl = project.images?.length > 0 
    ? `http://localhost:3000${project.images[0].image_url}` 
    : "/placeholder.jpg";

  const handleHeartClick = (e) => {
    e.stopPropagation(); 
    onToggleFavorite(project.id, isFavorite);
  };

  return (
    <div className="project-card" onClick={() => navigate(`/projects/${project.id}`)}>
      <img src={imageUrl} alt={project.title} />
      <h3>{project.title}</h3>
      <p>חדר: {project.room_type}</p>
      <p>סגנון: {project.style}</p>
      
      {/* כאן האיקון מופיע כחלק מהכרטיס בצורה נקייה */}
      <div className="card-actions">
        <button className="view-btn" onClick={() => navigate(`/projects/${project.id}`)}>
          צפה בפרויקט
        </button>
        <button className="heart-btn-minimal" onClick={handleHeartClick}>
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}