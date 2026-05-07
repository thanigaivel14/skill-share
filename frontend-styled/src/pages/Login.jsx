import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

const Login = () => {
  const { setUser, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [userinfo, setUserInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/user/login", userinfo, { withCredentials: true });
      fetchUser();
      setUser(res.data);
      navigate("/feed");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.log("Login failed:", err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 px-4">
      <div className="w-full max-w-sm fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">SkillShare</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-7">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
              <input
                autoFocus
                name="email"
                type="email"
                value={userinfo.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={userinfo.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
