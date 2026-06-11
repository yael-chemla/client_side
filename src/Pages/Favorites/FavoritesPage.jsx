import { useState, useEffect } from "react";
import { getFavorites, removeFromFavorites } from "../../API/favoritesApi";
import ProjectCard from "../Projects/components/ProjectCard";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => { fetchFavorites(); }, []);

    const fetchFavorites = async () => {
        try {
            const data = await getFavorites();
            setFavorites(data);
        } catch (err) {
            alert("שגיאה בטעינת המועדפים");
        }
    };

    return (
        <div className="favorites-page">
            <h2>המועדפים שלי</h2>
            <div className="project-grid">
                {favorites.map(project => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        isFavorite={true}
                        onToggleFavorite={async (id) => {
                            await removeFromFavorites(id);
                            fetchFavorites();
                        }}
                    />
                ))}
            </div>
        </div>
    );
}