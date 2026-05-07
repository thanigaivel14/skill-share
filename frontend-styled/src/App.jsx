import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { useAuth } from "./context/AuthContext";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root path redirect */}
      <Route
        path="/"
        element={user ? <Navigate to="/feed" replace /> : <Navigate to="/register" replace />}
      />
      
      {/* Authenticated routes */}
      <Route
        path="/feed"
        element={user ? <Feed /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/chat"
        element={user ? <Chat /> : <Navigate to="/login" replace />}
      />
      
      {/* Public routes */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/feed" replace />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/feed" replace />}
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to={user ? "/feed" : "/login"} replace />} />
      <Route path="/profile" element= {user?<Profile/>: <Navigate to="/login"/>}/>
    </Routes>
  );
}

export default App;