import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadProjectImage } from "../../API/projectImagesAPI";

export default function AddImages() {
    const { id } = useParams();
    const [images, setImages] = useState([]); // מערך של אובייקטים {file, is_before}
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).slice(0, 5);
        // הופכים כל קובץ לאובייקט עם ערך ברירת מחדל is_before: false
        const newImages = selectedFiles.map(file => ({
            file,
            is_before: false
        }));
        setImages(newImages);
    };

    const toggleIsBefore = (index) => {
        const updated = [...images];
        updated[index].is_before = !updated[index].is_before;
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
                        </div>
                    ))}
                </div>

                {images.length > 0 && <button onClick={handleUpload}>סיים ושמור</button>}
            </div>
        </div>
    );
}