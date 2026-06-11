import { Routes, Route, BrowserRouter } from "react-router-dom";
import { UserProvider } from './Hooks/UserContext';
import { SocketProvider } from './Hooks/SocketContext'; // 1. תוסיפי את זה בייבואים!
import ProtectedRoute from './Routes/ProtectedRoute';
import Navbar from './components/Navbar';

// דפים ציבוריים
import ProjectsPage from './Pages/Projects/ProjectsPage';
import Login from './Pages/LoginRegister/Login';
import Register from './Pages/LoginRegister/Register';
import DesignersPage from './Pages/Designers/DesignersPage';
// דפים מוגנים
import ProjectDetailsPage from './Pages/Projects/ProjectDetailsPage';
import MyProfile from './Pages/Profile/MyProfile';
import FavoritesPage from './Pages/Favorites/FavoritesPage';
import InboxPage from './Pages/Chat/InboxPage';
import ChatWindow from './Pages/Chat/ChatWindow';
import AddProject from './Pages/Projects/components/AddProject';
import AddImages from './Pages/Projects/components/AddImages';
import EditProject from './Pages/Projects/components/EditProject'; // תוסיפי את זה למעלה
import MyProjectsPage from './Pages/Projects/MyProjectsPage';

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <BrowserRouter>
          <Navbar />
          <div className="main-app-container">
            <Routes>
              {/* ראוטים פתוחים לכולם */}
              <Route path="/" element={<ProjectsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/designers" element={<DesignersPage />} /> {/* שורה חדשה */}
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute allowedRoles={['designer']} />}>
                <Route path="/my-projects" element={<MyProjectsPage />} />
                <Route path="/projects/add" element={<AddProject />} />
                <Route path="/projects/add-images/:id" element={<AddImages />} />
                <Route path="/edit-project/:id" element={<EditProject />} /> {/* זה הראוט החדש */}
              </Route>
              {/* ראוטים שדורשים התחברות */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/designer/:id" element={<MyProfile />} />              <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/inbox" element={<InboxPage />} />
                <Route path="/chat/:conversationId" element={<ChatWindow />} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;