import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../../API/projects";
import { ROOM_TYPES, STYLES } from "../../constants"; // ודאי שהנתיב נכון

export default function AddProject() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: "", description: "", style: "", room_type: "", budget_range: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newProject = await createProject(formData);
            alert("הפרויקט נוסף! כעת נעבור להוספת תמונות.");
            // מעבירים את ה-ID לעמוד הבא כדי לדעת לאיזה פרויקט שייכות התמונות
            navigate(`/projects/add-images/${newProject.id}`);
        } catch (err) {
            alert("שגיאה: " + err.message);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-card">
                <h2>הוספת פרויקט חדש</h2>
                <input type="text" placeholder="שם הפרויקט" onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                <textarea placeholder="תיאור" rows="4" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                <select onChange={(e) => setFormData({ ...formData, style: e.target.value })} required>
                    <option value="">בחר סגנון</option>
                    {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>

                <select onChange={(e) => setFormData({ ...formData, room_type: e.target.value })} required>
                    <option value="">בחר חדר</option>
                    {ROOM_TYPES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <input type="text" placeholder="טווח מחיר" onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })} />
                <button type="submit">המשך להוספת תמונות</button>
            </form>
        </div>
    );
}