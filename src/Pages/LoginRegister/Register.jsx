import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RegisterUser } from "../../API/auth";
import '../../CSS/auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: "client",
    city: "",
    bio: ""
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (file) {
      data.append("profile_image", file);
    }

    try {
      await RegisterUser(data, true); 
      alert("נרשמת בהצלחה!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "שגיאה בהרשמה");
    }
  };
  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>יצירת חשבון</h2>
        {error && <p className="error-message">{error}</p>}
        
        <input name="full_name" placeholder="שם מלא" onChange={handleChange} required />
        <input name="email" type="email" placeholder="אימייל" onChange={handleChange} required />
        <input name="password" type="password" placeholder="סיסמה" onChange={handleChange} required />
        <input name="phone" placeholder="טלפון" onChange={handleChange} />
        <input name="city" placeholder="עיר" onChange={handleChange} />
        
        <div style={{ marginBottom: '15px' }}>
          <label className="file-label">תמונת פרופיל:</label>
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </div>
        
        <select name="role" onChange={handleChange} value={formData.role}>
          <option value="client">לקוח</option>
          <option value="designer">מעצב פנים</option>
        </select>
        
        <textarea name="bio" placeholder="קצת עלייך..." onChange={handleChange} rows="3" />
        
        <button type="submit">הירשם</button>
        <p>כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link></p>
      </form>
    </div>
  );
}