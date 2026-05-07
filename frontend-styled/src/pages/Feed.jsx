import { useAuth } from "../context/AuthContext";
import API from "../api";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";
import CreatePost from "../components/CreatePost";
import socket from "../utils/socket";

const Feed = () => {
  const { user, logout, authReady } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createPost, setCreatePost] = useState(false);
  const [seenotification, setseenotification] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {

        const res = await API.get("posts/allpost");
        if (res.data?.data && Array.isArray(res.data.data)) {
          const arr = res.data.data.filter((post) => user?._id !== post.user?._id);
          setPosts(arr);
        }
      } catch (e) {
        console.error("Error fetching posts:", e.message);
        setError(e.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [createPost, user?._id, notifications]);

  useEffect(() => {
    if (createPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [createPost]);

  useEffect(() => {
    async function notification() {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data.notifications);
      } catch (e) {
        console.log(e.message);
      }
    }
    notification();
  }, []);

  socket.on("receiveNotification", async () => {
    const res = await API.get("/notifications");
    setNotifications(res.data.notifications);
  });

  const handleSeen = async (id, con) => {
    try {
      if (con === "seen") await API.put(`/notifications/${id}`);
      if (con === "delete") await API.delete(`/notifications/${id}`);
    } catch (e) {
      console.log(e.message);
    } finally {
      const res = await API.get("/notifications");
      setNotifications(res.data.notifications);
    }
  };

  const unreadCount = notifications?.length || 0;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-900 hidden sm:block">SkillShare</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
  {user.avatar ? (
    <img
      src={user.avatar}
      alt="profile"
      className="w-full h-full object-cover"
    />
  ) : (
    (user?.username?.[0] ).toUpperCase()
  )}
</div>
              <span className="hidden sm:block">{user?.username}</span>
            </button>

            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="hidden sm:block">Chat</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setseenotification((prev) => !prev)}
                className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-sm font-semibold text-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:block">Log out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Notification Dropdown */}
      {seenotification && (
        <div className="fixed top-16 right-4 w-80 sm:w-96 max-h-[60vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200 z-50 fade-up">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
            <button onClick={() => setseenotification(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-3 space-y-2">
            {notifications?.length > 0 ? (
              notifications.map((notifi) => (
                <div key={notifi._id} className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-sm text-slate-700 mb-2.5">{notifi.message}</p>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors"
                      onClick={() => handleSeen(notifi._id, "seen")}
                    >
                      Mark seen
                    </button>
                    <button
                      className="flex-1 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                      onClick={() => handleSeen(notifi._id, "delete")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-slate-400 py-6">You're all caught up!</p>
            )}
          </div>
        </div>
      )}

      {/* CreatePost Modal */}
      {createPost && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl fade-up">
            <CreatePost setCreatePost={setCreatePost} />
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse space-y-3">
                <div className="h-4 w-40 bg-slate-200 rounded-full" />
                <div className="h-3 w-full bg-slate-100 rounded-full" />
                <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 text-sm">{error}</div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => <PostCard post={post} key={post._id} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-sm font-medium">No posts yet</p>
            <p className="text-xs">Be the first to share a skill!</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setCreatePost((prev) => !prev)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm shadow-lg transition-all duration-200 active:scale-95 ${
            createPost
              ? "bg-slate-700 text-white hover:bg-slate-800"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            {createPost
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            }
          </svg>
          {createPost ? "Cancel" : "Share a Skill"}
        </button>
      </div>
    </div>
  );
};

export default Feed;
