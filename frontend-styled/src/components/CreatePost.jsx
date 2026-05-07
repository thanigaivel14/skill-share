import { useState } from "react";
import API from "../api";
import socket from "../utils/socket";
import { useAuth } from "../context/AuthContext";

const CreatePost = ({ setCreatePost }) => {
  const { user } = useAuth();
  const [createPostData, setCreatePostData] = useState({
    title: "",
    description: "",
    type: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreatePostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("posts/addpost", createPostData);
      setCreatePost(false);
      if (createPostData.type === "request")
        socket.emit("sendNotification", { userId: user._id, location: createPostData.location });
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <div>
      {/* Modal Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900">Share a Skill</h2>
        <button
          type="button"
          onClick={() => setCreatePost(false)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Title</label>
          <input
            type="text"
            name="title"
            value={createPostData.title}
            onChange={handleChange}
            placeholder="e.g. Plumbing repair, Guitar lessons…"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
          <input
            name="description"
            value={createPostData.description}
            onChange={handleChange}
            placeholder="Describe what you're offering or looking for…"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Type</label>
            <select
              name="type"
              value={createPostData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">Select…</option>
              <option value="request">Request</option>
              <option value="offer">Offer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Location</label>
            <input
              type="text"
              name="location"
              value={createPostData.location}
              onChange={handleChange}
              placeholder="Your area"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => setCreatePost(false)}
            className="flex-1 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-sm"
          >
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
