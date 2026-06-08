import { createContext, useState, useContext } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const login = (userToken, fullUserData) => {
    const minimalUser = {
      id: fullUserData.id,
      full_name: fullUserData.full_name,
      role: fullUserData.role,
      profile_image: fullUserData.profile_image
    };

    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(minimalUser));

    setToken(userToken);
    setUser(minimalUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <UserContext.Provider value={{ user, token, isAuthenticated, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useAuth = () => useContext(UserContext);