// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getProjectById, deleteProject } from "../../API/projects";
// import { useAuth } from "../../Hooks/UserContext";
// import { createConversation } from "../../API/chat"; // תוודאי שזה הנתיב הנכון
// import { APARTMENT_ROOM_TYPES } from "../../constants";
// export default function ProjectDetailsPage() {
//     const { id } = useParams();
//     const [project, setProject] = useState(null);
//     const navigate = useNavigate();
//     const { user, isAuthenticated } = useAuth(); // וודאי ש-user כולל את ה-ID של המשתמש המחובר

//     // בדיקה האם המשתמש המחובר הוא הבעלים של הפרויקט
//     const isOwner = isAuthenticated && user && project && (user.id === project.designer_id);

//     const handleDelete = async () => {
//         if (window.confirm("האם למחוק את הפרויקט לצמיתות?")) {
//             try {
//                 await deleteProject(id);
//                 alert("הפרויקט נמחק");
//                 navigate("/projects");
//             } catch (err) {
//                 alert("שגיאה במחיקה: " + err.message);
//             }
//         }
//     };

//     useEffect(() => {
//         // שליפת הפרויקט מהשרת (שימי לב: הפונקציה הזו צריכה להחזיר את כל המידע)
//         const loadProject = async () => {
//             const data = await getProjectById(id);
//             console.log(data.images); // <-- להוסיף כאן

//             setProject(data);
//         };
//         loadProject();
//     }, [id]);

//     if (!project) return <div className="loading">טוען פרטי פרויקט...</div>;
//     const handleChat = async () => {
//         if (!isAuthenticated) {
//             navigate('/login');
//             return;
//         }

//         try {
//             // פתיחת/יצירת שיחה עם המעצב/ת של הפרויקט
//             const conversation = await createConversation(project.designer_id);
//             // ניווט לשיחה עם ה-ID שחזר
//             navigate(`/chat/${conversation.conversationId}`);
//         } catch (err) {
//             console.error("שגיאה בפתיחת שיחה:", err);
//             alert("לא ניתן היה לפתוח שיחה כרגע");
//         }
//     };
//     const beforeImages = project.images?.filter(img => img.is_before);
//     const afterImages = project.images?.filter(img => !img.is_before);
//     const groupedRooms = {};

//     return (
//         <div className="project-details-container">
//             {/* כותרת ופרטים */}
//             <header className="project-header">
//                 <h1>{project.title}</h1>
//                 {/* כפתורי עריכה ומחיקה - מופיעים רק לבעלים */}
//                 {isOwner && (
//                     <div className="owner-actions">
//                         <button onClick={() => navigate(`/edit-project/${id}`)}>עדכון פרויקט</button>
//                         <button className="delete-btn" onClick={handleDelete}>מחיקת פרויקט</button>
//                     </div>
//                 )}
//                 <div className="designer-profile">
//                     <img
//                         src={project.designer_avatar ? `http://localhost:3000${project.designer_avatar}` : "/default-avatar.png"}
//                         alt="designer"
//                         className="designer-avatar"
//                         onError={(e) => { e.target.src = "/default-avatar.png"; }}
//                     />                    <p className="designer-name">מעצבת: {project.designer_name}</p>
//                 </div>

//                 <div className="tags">
//                     <span><strong>חדר:</strong> {project.room_type}</span>
//                     <span><strong>סגנון:</strong> {project.style}</span>
//                     <span><strong>תקציב:</strong> {project.budget_range}</span>
//                 </div>
//             </header>

//             {/* גלריית תמונות */}
//             <section className="project-gallery">
//                 {beforeImages.length > 0 && (
//                     <div className="gallery-section">
//                         <h2 className="gallery-section-title">לפני השיפוץ</h2>
//                         <div className="images-row">
//                             {beforeImages.map(img => (
//                                 <div key={img.id} className="image-wrapper">
//                                     <img
//                                         src={`http://localhost:3000${img.image_url}`}
//                                         alt={img.room_type || project.title}
//                                     />
//                                     {img.room_type && (
//                                         <span className="image-room-label">{img.room_type}</span>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {afterImages.length > 0 && (
//                     <div className="gallery-section">
//                         <h2 className="gallery-section-title">אחרי השיפוץ</h2>
//                         <div className="images-row">
//                             {afterImages.map(img => (
//                                 <div key={img.id} className="image-wrapper">
//                                     <img
//                                         src={`http://localhost:3000${img.image_url}`}
//                                         alt={img.room_type || project.title}
//                                     />
//                                     {img.room_type && (
//                                         <span className="image-room-label">{img.room_type}</span>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </section>

//             {/* תיאור וכפתור צ'אט (מופיע פעם אחת!) */}
//             <article className="project-description">
//                 <h3>על הפרויקט</h3>
//                 <p>{project.description}</p>

//                 {!isOwner && (
//                     <div className="chat-container">
//                         <button
//                             className="chat-btn"
//                             onClick={handleChat}
//                         >
//                             {isAuthenticated ? "צ'אט עם המעצבת" : "התחבר כדי לשוחח עם המעצבת"}
//                         </button>
//                     </div>
//                 )}
//             </article>
//         </div>
//     );
// }

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
            const data = await getProjectById(id);
            setProject(data);
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