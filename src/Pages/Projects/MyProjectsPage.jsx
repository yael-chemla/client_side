import { useState, useEffect } from "react";
import { getMyProjects } from "../../API/projects";
import ProjectList from "./components/ProjectList";
import "../../CSS/projects.css";

export default function MyProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyProjects = async () => {
            try {
                const data = await getMyProjects();
                setProjects(data);
            } catch (err) {
                console.error("שגיאה בטעינת הפרויקטים", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyProjects();
    }, []);

    if (loading) return <div className="loading">טוען פרויקטים...</div>;

    return (
        <div className="projects-container">
            <h2>הפרויקטים שלי</h2>
            <ProjectList
                projects={projects}
                favorites={[]}
                onToggleFavorite={() => { }}
                showFavorite={false}
            />
        </div>
    );
}