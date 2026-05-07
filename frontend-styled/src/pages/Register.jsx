import { useNavigate } from "react-router-dom";
import API from "../api";
import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [userinfo, setUserInfo] = useState({ username: "", email: "", password: "", location: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/user/register", userinfo);
      navigate("/login");
    } catch (e) {
      setError("Registration failed. Please try again.");
      console.error(`Registration failed: ${e.message}`);
    }
  };

  const fields = [
    { name: "username", label: "Username", type: "text", placeholder: "johndoe", autoFocus: true },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "new-password" },
    { name: "location", label: "Location", type: "text", placeholder: "Chennai, Tamil Nadu" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 px-4 py-10">
      <div className="w-full max-w-sm fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Join SkillShare</h1>
          <p className="text-sm text-slate-500 mt-1">Create your neighbourhood account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-7">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  value={userinfo[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  autoFocus={f.autoFocus}
                  autoComplete={f.autoComplete}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              Create Account
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
