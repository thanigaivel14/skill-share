import { useState } from "react";
import Message from "./Message";

const typeColors = {
  offer: "bg-emerald-50 text-emerald-700 border-emerald-100",
  request: "bg-amber-50 text-amber-700 border-amber-100",
};

const PostCard = ({ post }) => {
  const [messageClick, setMessage] = useState(false);

  const handleClick = () => setMessage((prev) => !prev);

  const typeStyle = typeColors[post.type] || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 transition-shadow hover:shadow-md">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-slate-900 leading-snug">{post.title}</h3>
        {post.type && (
          <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${typeStyle}`}>
            {post.type}
          </span>
        )}
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.description}</p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {post.user?.username || "Anonymous"}
        </span>
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {post.location}
        </span>
      </div>

      {/* Message box */}
      {messageClick && (
        <div className="mb-3">
          <Message post={post} handleclick={handleClick} />
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
            messageClick
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {messageClick
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            }
          </svg>
          {messageClick ? "Cancel" : "Message"}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
