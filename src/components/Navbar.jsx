import { useAuth } from "../Hooks/UserContext";
import { Link, useNavigate } from 'react-router-dom';
import "../CSS/Navbar.css";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar-sticky">
      {/* צד ימין - פרופיל ופעולות משתמש */}
      <div className="nav-group nav-right">
        {isAuthenticated ? (
          <>
            {/* כפתור הפרופיל החדש */}
            <Link to="/profile" className="nav-link-profile-action">הפרופיל שלי</Link>

            {/* תצוגת שם ותמונה בלבד */}
            <div className="user-profile-display">
              {user?.profile_image && (
                <img
                  src={user.profile_image.startsWith('http') ? user.profile_image : `http://localhost:3000${user.profile_image}`}
                  alt="profile"
                  className="nav-avatar"
                  onError={(e) => { e.target.src = "/default-avatar.png"; }}
                />
              )}
              <span>{user?.full_name}</span>
            </div>

            <button onClick={handleLogout} className="nav-btn-logout">התנתקות</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">התחברות</Link>
            <Link to="/register" className="nav-btn-register">הרשמה</Link>
          </>
        )}
      </div>

      {/* מרכז - לוגו */}
      <div className="nav-center">
        <Link to="/" className="logo-text">SpaceCraft</Link>
      </div>

      {/* צד שמאל - ניווט */}
      <div className="nav-group nav-left">
        {isAuthenticated && (
          <>
            {user?.role === 'designer' && <Link to="/my-projects" className="nav-link">הפרויקטים שלי</Link>}
            <Link to="/inbox" className="nav-link">הודעות 📬</Link>            <Link to="/favorites" className="nav-link">מועדפים</Link>
          </>
        )}
        <Link to="/designers" className="nav-link">מעצבות</Link>
        <Link to="/projects" className="nav-link">פרויקטים</Link>
      </div>
    </nav>
  );
}