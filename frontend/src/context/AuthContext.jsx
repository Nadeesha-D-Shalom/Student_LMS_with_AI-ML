import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const me = await apiFetch("/api/me");
      setUser(me);
    } catch {
      localStorage.removeItem("lms_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const refresh = async () => {
    setLoading(true);
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem("lms_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
