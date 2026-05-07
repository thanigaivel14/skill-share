import { useState } from "react";
import API from "../api";

const Message = ({ post, handleclick }) => {
  const [req, setReq] = useState({
    receiverId: post.user?._id,
    content: "",
    postId: post._id,
  });

  const handleChange = (e) => {
    setReq((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await API.post("message/sendmessage", req);
      setReq((prev) => ({ ...prev, content: "" }));
      handleclick();
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
      <input
        type="text"
        value={req.content}
        onChange={handleChange}
        placeholder="Write a message…"
        className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none py-1"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        autoFocus
      />
      <button
        onClick={handleSubmit}
        className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all duration-200 flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </div>
  );
};

export default Message;
