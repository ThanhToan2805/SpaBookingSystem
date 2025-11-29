import { createContext, useState, useEffect, useContext } from "react";
import { decodeToken } from "../utils/jwt";
import { authApi } from "../api/authApi";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser(decodeToken(token));
        }
        setLoading(false);
    }, []);

    const login = async ({ EmailOrUsername, Password }) => {
        const res = await authApi.login({ EmailOrUsername, Password });
        const token = res.token; // match với BE
        console.log("Raw token:", token);
        localStorage.setItem("token", token);
        const userData = decodeToken(token);
        console.log("Decoded user:", userData)
        setUser(userData);
        return userData;
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
}

// Custom hook để dùng AuthContext
export function useAuth() {
    return useContext(AuthContext);
}