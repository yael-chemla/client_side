import { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadProjectImage } from "../../../API/projectImagesAPI";
import { getProjectById } from "../../../API/projects";
import { APARTMENT_ROOM_TYPES } from "../../../constants";

export default function AddImages() {
    const { id } = useParams();
    const [images, setImages] = useState([]); // מערך של אובייקטים {file, is_before}
    const [projectRoomType, setProjectRoomType] = useState("");
    const navigate = useNavigate();

    // ✅ שולפים את הפרויקט כדי לדעת אם זה דירה
    useEffect(() => {
        const fetchProject = async () => {
            const data = await getProjectById(id);
            setProjectRoomType(data.room_type);
        };
        fetchProject();
    }, [id]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).slice(0, 10);
        // הופכים כל קובץ לאובייקט עם ערך ברירת מחדל is_before: false
        const newImages = selectedFiles.map(file => ({
            file,
            is_before: false,
            room_type: ""
        }));
        setImages(newImages);
    };

    const toggleIsBefore = (index) => {
        const updated = [...images];
        updated[index].is_before = !updated[index].is_before;
        setImages(updated);
    };

    const handleRoomTypeChange = (index, value) => {
        const updated = [...images];
        updated[index].room_type = value;
        setImages(updated);
    };

    const handleUpload = async () => {
        try {
            // 1. העלאת כל התמונות
            for (let img of images) {
                const formData = new FormData();
                formData.append("image", img.file);
                formData.append("project_id", id);
                formData.append("is_before", img.is_before);
                formData.append("room_type", img.room_type);
                           console.log("שולחת:", img.file.name, "is_before:", img.is_before, "room_type:", img.room_type, "project_id:", id);

                // נשתמש ב-await, אם זה נכשל, הקוד יקפוץ ל-catch
                await uploadProjectImage(formData);
            }

            alert("הפרויקט והתמונות נוספו בהצלחה!");
            // 2. ניווט מובטח רק אחרי שהכל הסתיים
            navigate("/projects");

        } catch (err) {
            // אם הגענו לכאן, השרת החזיר שגיאה (500)
            console.error("שגיאה בהעלאת התמונות:", err);
            alert("קרתה שגיאה בהעלאת התמונות. אנא בדקי את החיבור או נסי שוב.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>העלאת תמונות (עד 10)</h2>
                <input type="file" multiple onChange={handleFileChange} className="file-input" />

                <div className="image-list">
                    {images.map((img, index) => (
                        <div key={index} className="image-item">
                            <span className="file-name">{img.file.name}</span>
                            <label className="checkbox-label">
                                <input type="checkbox" checked={img.is_before} onChange={() => toggleIsBefore(index)} />
                                תמונת "לפני"
                            </label>

                            {projectRoomType === "דירה" && (
                                <select
                                    value={img.room_type}
                                    onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                                >
                                    <option value="">בחר סוג חדר</option>
                                    {APARTMENT_ROOM_TYPES.map(r => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}
                </div>

                {images.length > 0 && <button onClick={handleUpload}>סיים ושמור</button>}
            </div>
        </div>
    );
}