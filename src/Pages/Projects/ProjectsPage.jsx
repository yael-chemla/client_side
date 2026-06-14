import { useState, useEffect } from "react";
import { getProjects } from "../../API/projects";
import { getFavorites, addToFavorites, removeFromFavorites } from "../../API/favoritesApi";
import ProjectList from "./components/ProjectList";
import ProjectFilters from "./components/ProjectFilters";
import Pagination from "./components/Pagination";
import { useAuth } from "../../Hooks/UserContext";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import '../../CSS/projects.css';



export default function ProjectsPage() {
    const [searchParams] = useSearchParams(); 
    const [projects, setProjects] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [favorites, setFavorites] = useState([]);
    const [filters, setFilters] = useState({
        room_type: "",
        style: "",
        designer_name: "",
        designer_id: searchParams.get("designer_id") || "", 
        page: 1
    });
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const loadData = async (currentFilters) => {
        try {
            const data = await getProjects(currentFilters);
            setProjects(data.projects);
            setMetadata(data.metadata);

            if (isAuthenticated) {
                const favs = await getFavorites();
                setFavorites(favs.map(f => f.id)); 
            }
        } catch (err) {
            console.error("שגיאה בטעינת נתונים:", err);
        }
    };

    useEffect(() => {
        loadData(filters);
    }, [filters, isAuthenticated]); 

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