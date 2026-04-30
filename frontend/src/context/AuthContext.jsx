import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = accessToken || localStorage.getItem("accessToken");

    if (token) {
      api.get("me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("userRole", res.data.role);
      })
      .catch(() => logout());
    }
  }, [accessToken]);

  const login = async (username, password) => {
    const res = await api.post("token/", { username, password });

    localStorage.setItem("accessToken", res.data.access);
    localStorage.setItem("refreshToken", res.data.refresh);

    setAccessToken(res.data.access);
    setRefreshToken(res.data.refresh);

    const userRes = await api.get("me/", {
      headers: {
        Authorization: `Bearer ${res.data.access}`,
      },
    });

    setUser(userRes.data);
    localStorage.setItem("userRole", userRes.data.role);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}