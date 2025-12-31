import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check login on refresh
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setLoading(false);
    return;
  }

  api
    .get("/auth/me")
    .then((res) => setUser(res.data))
    .catch(() => {
      localStorage.removeItem("token");
      setUser(null);
    })
    .finally(() => setLoading(false));
}, []);


  const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });

  const { token, user } = res.data;

  localStorage.setItem("token", token);
  setUser(user);

  return user;
};



  const logout = () => {
  localStorage.removeItem("token");
  setUser(null);
};


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
