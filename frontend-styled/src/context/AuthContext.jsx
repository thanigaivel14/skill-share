  import { createContext, useContext, useEffect, useState } from "react";
  import API from "../api";
  import { useNavigate } from "react-router-dom";
  import socket from "../utils/socket";
import { useLocation } from "react-router-dom";
  const AuthContext = createContext();

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authReady, setAuthReady] = useState(false);

    const navigate = useNavigate();
useEffect(() => {
  const publicPaths = ["/login", "/register"];
  if (!publicPaths.includes(location.pathname)) {
    fetchUser();
  } else {
    setLoading(false);
    setAuthReady(true);
  }
}, []);
    
      const fetchUser = async () => {
        try {
          const res = await API.get("/user/me");

          if (res.data.user?._id) {
            if (socket.connected) {
              console.log("register")
              socket.emit("register", res.data.user._id);
            }
            setUser(res.data.user);
          } else {
            setUser(null);
          }
        } catch (error) {
          setUser(null);
        } finally {
          setAuthReady(true);
          setLoading(false);
        }
      };

      
    
      

    const logout = async () => {
      try {
        await API.post("/user/logout");
        setUser(null);
        socket.emit("manualLogout");
        navigate("/login");
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

    return (
      <AuthContext.Provider value={{ user, setUser, logout, loading, setLoading, authReady,fetchUser }}>
        {children}
      </AuthContext.Provider>
    );
  };

  export const useAuth = () => useContext(AuthContext);
