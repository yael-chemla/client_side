import { useState, useEffect } from "react";
import { getProjects } from "../../API/projects";
import { getFavorites, addToFavorites, removeFromFavorites } from "../../API/favoritesApi";
import ProjectList from "./components/ProjectList";
import ProjectFilters from "./components/ProjectFilters";
import Pagination from "./components/Pagination";
import { useAuth } from "../../Hooks/UserContext";
import { useNavigate } from "react-router-dom"; 
import '../../CSS/projects.css'; 



export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [filters, setFilters] = useState({ room_type: "", style: "", designer_name: "", page: 1 });
    const [metadata, setMetadata] = useState({});
    const [favorites, setFavorites] = useState([]); 

    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // 1. טעינת הפרויקטים (והמועדפים אם המשתמש מחובר)
    const loadData = async (currentFilters) => {
        try {
            const data = await getProjects(currentFilters);
            setProjects(data.projects);
            setMetadata(data.metadata);

            // אם המשתמש מחובר, נטען גם את המועדפים שלו
            if (isAuthenticated) {
                const favs = await getFavorites();
                setFavorites(favs.map(f => f.id)); // נשמור רק את ה-IDs של הפרויקטים המועדפים
            }
        } catch (err) {
            console.error("שגיאה בטעינת נתונים:", err);
        }
    };

    useEffect(() => {
        loadData(filters);
    }, [filters, isAuthenticated]); // טעינה מחדש אם הפילטרים או מצב ההתחברות השתנו

    // 2. פונקציית טיפול במועדפים
    const handleToggleFavorite = async (projectId, isFav) => {
        if (!isAuthenticated) {
            alert("יש להתחבר כדי להוסיף למועדפים");
            return;
        }

        try {
            if (isFav) {
                await removeFromFavorites(projectId);
                setFavorites(favorites.filter(id => id !== projectId));
            } else {
                await addToFavorites(projectId);
                setFavorites([...favorites, projectId]);
            }
        } catch (err) {
            alert("שגיאה בעדכון המועדפים");
        }
    };

    const changePage = (pageNum) => {
        setFilters(prev => ({ ...prev, page: pageNum }));
    };

    const handleFilterChange = (newFilterData) => {
        setFilters(prev => ({ ...prev, ...newFilterData, page: 1 }));
    };

    return (
        <div className="projects-page-layout">
            <aside className="sidebar">
                <ProjectFilters setFilters={handleFilterChange} />
                {isAuthenticated && user?.role === 'designer' && (
                    <button className="add-project-btn" onClick={() => navigate('/projects/add')}>
                        + הוסף פרויקט חדש
                    </button>
                )}
            </aside>
            <main className="content">
                {/* מעבירים ל-ProjectList גם את המועדפים ואת פונקציית העדכון */}
                <ProjectList
                    projects={projects}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                />
                <Pagination metadata={metadata} onPageChange={changePage} />
            </main>
        </div>
    );
}