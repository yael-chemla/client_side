import "../../../CSS/projects.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, updateProject } from "../../../API/projects";
import { deleteImage, updateImage } from "../../../API/projectImagesAPI";
import EditProjectImages from "./EditProjectImages";
import { ROOM_TYPES, STYLES } from "../../../constants"; 
export default function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        title: "", description: "", style: "", room_type: "", budget_range: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProjectById(id);
                setFormData({
                    title: data.title,
                    description: data.description,
                    style: data.style,
                    room_type: data.room_type,
                    budget_range: data.budget_range
                });
                setImages(data.images || []);
                setLoading(false);
            } catch (err) {
                alert("שגיאה בטעינת הפרויקט");
                navigate("/projects");
            }
        };
        fetchProject();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProject(id, formData);
            alert("הפרויקט עודכן בהצלחה!");
            navigate("/projects");
        } catch (err) {
            alert("שגיאה בעדכון: " + err.message);
        }
    };

    const handleDeleteImage = async (imgId) => {
        if (window.confirm("למחוק את התמונה הזו?")) {
            try {
                await deleteImage(imgId);
                setImages(images.filter(img => img.id !== imgId));
            } catch (err) {
                alert("שגיאה במחיקה: " + err.message);
            }
        }
    };

    const handleToggleBefore = async (imgId, newValue) => {
        try {
            await updateImage(imgId, newValue);
            setImages(images.map(img => img.id === imgId ? { ...img, is_before: newValue } : img));
        } catch (err) {
            alert("שגיאה בעדכון מצב תמונה: " + err.message);
        }
    };

    const handleRoomTypeChange = async (imgId, newRoomType) => {
        try {
            const img = images.find(i => i.id === imgId);
            await updateImage(imgId, img.is_before, newRoomType);
            setImages(images.map(i => i.id === imgId ? { ...i, room_type: newRoomType } : i));
        } catch (err) {
            alert("שגיאה בעדכון סוג החדר: " + err.message);
        }
    };

    if (loading) return <div className="auth-container">טוען...</div>;

    return (
    <div className="edit-project-page">
        <form onSubmit={handleSubmit} className="edit-project-form">
            <h2>עריכת פרויקט</h2>

            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="שם הפרויקט" />
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="תיאור" />

            <select value={formData.style} onChange={(e) => setFormData({ ...formData, style: e.target.value })}>
                {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>

            <select value={formData.room_type} onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}>
                {ROOM_TYPES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
        </form>

        <div className="edit-images-wrapper">
            <EditProjectImages
                images={images}
                onDelete={handleDeleteImage}
                onToggleBefore={handleToggleBefore}
                onRoomTypeChange={handleRoomTypeChange}
                projectRoomType={formData.room_type}
            />
        </div>

        <div className="edit-form-actions">
            <button type="button" className="secondary-btn" onClick={() => navigate(`/projects/add-images/${id}`)}>
                הוסף תמונות חדשות
            </button>
            <button type="button" className="primary-btn" onClick={handleSubmit}>שמור שינויים</button>
        </div>
    </div>
);
}