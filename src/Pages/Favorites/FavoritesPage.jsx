import { useState, useEffect } from "react";
import { getFavorites, removeFromFavorites } from "../../API/favoritesApi";
import ProjectCard from "../Projects/components/ProjectCard";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => { fetchFavorites(); }, []);

    const fetchFavorites = async () => {
        const data = await getFavorites();
        setFavorites(data);
    };

    return (
        <div className="project-details-container"> 
            <h2>המועדפים שלי</h2>
            <div className="project-grid">
                {favorites.map(project => (
                    <ProjectCard 
                        key={project.id} 
                        project={project} 
                        isFavorite={true} // בעמוד הזה תמיד true
                        onToggleFavorite={async (id) => {
                            await removeFromFavorites(id);
                            fetchFavorites(); // רענון הרשימה אחרי מחיקה
                        }} 
                    />
                ))}
            </div>
        </div>
    );
}