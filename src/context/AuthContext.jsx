import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, clearToken, getToken, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));
  const [notice, setNotice] = useState("");

  // Restore the session from the saved token on page load
  useEffect(() => {
    if (!getToken()) return;
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  // The API client fires this when the token expires or the account is blocked
  useEffect(() => {
    const handleLogout = (event) => {
      setUser(null);
      if (event.detail) setNotice(event.detail);
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const saveSession = async (data) => {
    setToken(data.token);
    // login/register return a short user object, so load the full profile
    let fullUser = { ...data.user, _id: data.user.id };
    try {
      fullUser = (await api("/auth/me")).user;
    } catch {
      // keep the short version
    }
    setUser(fullUser);
    setNotice("");
    return fullUser;
  };

  const login = async (credentials) =>
    saveSession(await api("/auth/login", { method: "POST", body: credentials }));

  const register = async (details) =>
    saveSession(await api("/auth/register", { method: "POST", body: details }));

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, notice, setNotice }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

// Where each role lands after signing in
// eslint-disable-next-line react-refresh/only-export-components
export const homeFor = (user) => (user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
