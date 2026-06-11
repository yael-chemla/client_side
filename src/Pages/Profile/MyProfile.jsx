import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ודאי שזה פה לניווט
import { getMyProfile, updateMyProfile, getDesignerProfile } from "../../API/users";
import { useAuth } from "../../Hooks/UserContext"; // <--- השורה הזו חסרה לך!
import "../../CSS/Profile.css";
import { API_BASE_URL } from "../../constants";
import { createConversation } from "../../API/chat";

export default function MyProfile() {
    const { id } = useParams(); // תופסים את ה-id מה-URL אם קיים
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({ full_name: "", email: "", phone: "", city: "", bio: "" });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const { updateUser } = useAuth();
    const navigate = useNavigate();

    const isOwnProfile = !id; // אם אין ID, זה הפרופיל שלי

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = isOwnProfile ? await getMyProfile() : await getDesignerProfile(id);
                console.log("Data from server:", data);
                const profileData = isOwnProfile ? data : data.designer;
                setProfile(profileData);
                setFormData({
                    full_name: profileData.full_name || "",
                    email: profileData.email || "",
                    phone: profileData.phone || "",
                    city: profileData.city || "",
                    bio: profileData.bio || ""
                });
            } catch (err) {
                console.error("Error fetching profile:", err);
                alert("שגיאה בטעינת פרופיל");
            }
            finally { setLoading(false); }
        };
        fetchProfile();
    }, [id, isOwnProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        // נוסיף רק את מה שניתן לעריכה
        data.append("full_name", formData.full_name);
        data.append("phone", formData.phone);
        data.append("city", formData.city);
        data.append("bio", formData.bio);
        if (image) data.append("profile_image", image);

        try {
            const updatedProfile = await updateMyProfile(data);
            updateUser(updatedProfile);
            alert("הפרופיל עודכן בהצלחה!");
            navigate("/projects");
        } catch (err) { alert("שגיאה בעדכון: " + err.message); }
    };

    const handleChat = async () => {
        try {
            const response = await createConversation(profile.id);
            if (response?.conversationId) {
                navigate(`/chat/${response.conversationId}`);
            }
        } catch (err) {
            alert("לא ניתן היה לפתוח שיחה.");
        }
    };

    if (loading || !profile) return <div className="loading">טוען פרופיל...</div>;

    return (
        <div className="profile-container">
            <h2>{isOwnProfile ? "הפרופיל שלי" : `הפרופיל של ${profile.full_name}`}</h2>

            <img
                src={profile.profile_image ? (profile.profile_image.startsWith("http") ? profile.profile_image : `${API_BASE_URL}${profile.profile_image}`) : "/default-avatar.png"}
                alt="profile" className="profile-big-avatar"
            />

            {isOwnProfile ? (
                // תצוגת עריכה - רק למשתמש המחובר
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>תמונת פרופיל</label>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="form-group">
                        <label>שם מלא</label>
                        <input value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>אימייל</label>
                        <input value={formData.email} disabled style={{ backgroundColor: '#eee' }} />
                    </div>
                    <div className="form-group">
                        <label>טלפון</label>
                        <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>עיר</label>
                        <input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>ביוגרפיה</label>
                        <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                    </div>
                    <button type="submit">שמור שינויים</button>
                </form>
            ) : (
                // תצוגה בלבד - ללקוחות שצופים במעצבת
                <div className="profile-view">
                    <p><strong>עיר:</strong> {profile.city}</p>
                    <p><strong>אודות:</strong> {profile.bio}</p>
                    <button className="chat-btn" onClick={handleChat}>
                        שלח הודעה למעצבת
                    </button>                </div>
            )}
        </div>
    );
}