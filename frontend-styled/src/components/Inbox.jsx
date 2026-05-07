const Inbox = ({ inbox, loading, setPartner }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Messages</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {inbox.length} conversation{inbox.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        {loading ? (
          <div className="flex flex-col gap-2 pt-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-slate-200 rounded-full" />
                  <div className="h-2.5 w-36 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : inbox.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm font-medium">No conversations yet</p>
            <p className="text-xs mt-1">Start chatting from the feed!</p>
          </div>
        ) : (
          inbox.map((chat, i) => (
            <button
              key={chat.partnerId}
              onClick={() => setPartner(chat.partnerId)}
              className={`
                slide-in w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left
                transition-colors duration-150 group
                ${chat.seen
                  ? "hover:bg-slate-50"
                  : "bg-blue-50 hover:bg-blue-100"
                }
              `}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {/* Avatar initial */}
              <div className={`
                w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold
                ${chat.seen ? "bg-slate-100 text-slate-500" : "bg-blue-600 text-white"}
              `}>
                {/* {chat.partnerName?.[0]?.toUpperCase() || "?"} */}
                {/* <img src={chat.partnerAvatar} alt="" />  */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
  {chat.partnerAvatar ? (
    <img
      src={chat.partnerAvatar}
      alt="profile"
      className="w-full h-full object-cover"
    />
  ) : (
    chat.partnerName?.[0]?.toUpperCase()
  )}
</div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold truncate ${chat.seen ? "text-slate-700" : "text-blue-700"}`}>
                    {chat.partnerName}
                  </span>
                  {!chat.seen && (
                    <span className="ml-2 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">{chat.lastMessage}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;
