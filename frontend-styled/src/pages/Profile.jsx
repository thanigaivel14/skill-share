import { useEffect, useState, useRef } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const [avatar, Setavatar] = useState(null);
  const { user, setUser } = useAuth();
  const [posts, SetPosts] = useState([]);
  const [showPosts, SetShowPosts] = useState(false);
  const fileInputRef = useRef(null);
  const [edit, setEdit] = useState(false);
  const [info, setInfo] = useState({ username: user?.username || "", location: user?.location || "" });

  useEffect(() => {
    if (user) {
      setInfo({ username: user.username || "", location: user.location || "" });
      if (user.avatar && !avatar) Setavatar(user.avatar);
    }
  }, [user]);

  const triggerFileInput = () => fileInputRef.current.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      Setavatar(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        const res = await API.put("user/update", formData, { headers: { "Content-Type": "multipart/form-data" } });
        if (res.data.user) setUser(res.data.user);
      } catch (e) {
        console.error("Error uploading avatar: " + e.message);
      }
    }
  };

  const handleEditing = async () => {
    try {
      const res = await API.put("user/update", info);
      setUser(res.data.user);
      setEdit(false);
    } catch (e) {
      console.error("Error updating profile: " + e.message);
    }
  };

  const togglePosts = async () => {
    if (showPosts) {
      SetShowPosts(false);
      SetPosts([]);
    } else {
      try {
        const res = await API.get("posts/singlepostByuser");
        SetPosts(res.data.data);
        SetShowPosts(true);
      } catch (e) {
        console.error(e.message);
        SetPosts([]);
      }
    }
  };

  const handleEditProfile = () => {
    if (!edit && user) setInfo({ username: user.username, location: user.location });
    setEdit((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`posts/deletepost/${id}`);
      SetPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      console.error("Delete error: " + e.message);
    }
  };

  const handleCompleted = async (id) => {
    try {
      await API.put(`posts/markascomplete/${id}`);
      SetPosts((prev) => prev.map((p) => (p._id === id ? { ...p, status: "completed" } : p)));
    } catch (e) {
      console.error("Completion error: " + e.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-xl mx-auto fade-up">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
          {/* Cover */}
          <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-700" />

          {/* Avatar + Info */}
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-12 mb-4">
              <div className="relative flex-shrink-0">
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleAvatarChange} />
                <img
                  src={avatar || user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=2563eb&color=fff`}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
                />
                <button
                  onClick={triggerFileInput}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors"
                  title="Change photo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 min-w-0 pb-1">
                {!edit ? (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{user.username}</h2>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </>
                ) : (
                  <input
                    type="text"
                    name="username"
                    onChange={handleChange}
                    value={info.username}
                    className="text-xl font-bold text-slate-900 w-full border-b-2 border-blue-500 focus:outline-none bg-transparent"
                    placeholder="Username"
                  />
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {!edit ? (
                <span className="text-sm text-slate-600">{user.location || "No location set"}</span>
              ) : (
                <input
                  type="text"
                  name="location"
                  onChange={handleChange}
                  value={info.location}
                  className="text-sm text-slate-600 flex-1 border-b border-slate-300 focus:outline-none focus:border-blue-500 bg-transparent"
                  placeholder="Your location"
                />
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              {edit ? (
                <button
                  onClick={handleEditing}
                  className="flex-1 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 active:scale-[0.98] transition-all"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={handleEditProfile}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 active:scale-[0.98] transition-all"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={togglePosts}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all ${
                  showPosts
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {showPosts ? "Hide Posts" : "My Posts"}
              </button>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        {showPosts && (
          <div className="space-y-3 fade-up">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide px-1">Your Posts ({posts.length})</h3>
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-base font-semibold text-slate-900">{post.title}</h4>
                    {post.status === "completed" ? (
                      <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Completed
                      </span>
                    ) : (
                      <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                        {post.type}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">{post.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                    <span>{post.location}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                    {post.status !== "completed" && (
                      <button
                        className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition-colors"
                        onClick={() => handleCompleted(post._id)}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm">You haven't posted anything yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
