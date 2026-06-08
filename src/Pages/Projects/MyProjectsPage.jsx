import { useState, useEffect } from "react";
import { getMyProjects } from "../../API/projects";
import ProjectCard from "../Projects/components/ProjectCard"; 
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
    console.log("Check first project images:", projects[0]);
    return (
        <div className="projects-container">
            <h2>הפרויקטים שלי</h2>
            {projects.length === 0 ? (
                <p>עדיין אין לך פרויקטים.</p>
            ) : (
                <div className="project-grid">
                    {projects.map((p) => (
                        <ProjectCard key={p.id} project={p} />
                    ))}
                </div>
            )}
        </div>
    );
}