import ProjectCard from "./ProjectCard";
import { useState, useEffect } from "react";
import { getProjects } from "../../../API/projects";

export default function ProjectList({ projects, favorites, onToggleFavorite , showFavorite = true}) {
    if (!projects || projects.length === 0) return <p>לא נמצאו פרויקטים.</p>;

    return (
        <div className="project-grid">
            {projects.map((p) => (
                <ProjectCard
                    key={p.id}
                    project={p}
                    isFavorite={favorites.includes(p.id)} // האם הפרויקט הזה במועדפים?
                    onToggleFavorite={onToggleFavorite}
                    showFavorite={showFavorite}
                />
            ))}
        </div>
    );
}