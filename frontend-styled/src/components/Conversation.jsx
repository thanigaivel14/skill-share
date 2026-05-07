import { useEffect, useState, useRef } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import socket from "../utils/socket";

const Conversation = ({ partner }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const currentUser = user;
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [partnerData, setPartnerData] = useState(null);
  const [req, setReq] = useState({ receiverId: partner, content: "" });

  // Fetch messages when partner changes
  useEffect(() => {
    if (!partner) return;
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await API.get(`message/getmessage/${partner}`);
        if (res.data?.data) {
          setMessages(res.data.data);
          // Extract partner details from the first message
          if (res.data.data.length > 0) {
            const first = res.data.data[0];
            const partnerInfo =
              first.sender._id === currentUser._id
                ? first.receiver
                : first.sender;
            setPartnerData(partnerInfo);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [partner]);

  // Real-time incoming messages
  useEffect(() => {
    const handleIncoming = (incomingMessage) => {
      const senderId =
        typeof incomingMessage.sender === "object"
          ? incomingMessage.sender._id
          : incomingMessage.sender;

      const receiverId =
        typeof incomingMessage.receiver === "object"
          ? incomingMessage.receiver._id
          : incomingMessage.receiver;

      // Only add if this message belongs to the current conversation
      const belongsHere =
        senderId === partner ||
        receiverId === partner ||
        senderId === currentUser._id ||
        receiverId === currentUser._id;

      if (!belongsHere) return;

      // Deduplicate by _id — avoid double-render from socket echoes
      setMessages((prev) => {
        if (incomingMessage._id && prev.some((m) => m._id === incomingMessage._id)) {
          return prev;
        }
        return [...prev, incomingMessage];
      });

      // If we don't have partner data yet (first message in a new chat), set it
      setPartnerData((prev) => {
        if (prev) return prev;
        return senderId === currentUser._id
          ? incomingMessage.receiver
          : incomingMessage.sender;
      });
    };

    socket.on("receiveMessage", handleIncoming);
    return () => { socket.off("receiveMessage", handleIncoming); };
  }, [partner, currentUser._id]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (e) => {
    setReq({ ...req, receiverId: partner, content: e.target.value });
  };

  const handleSendMessage = async () => {
    if (!req.content.trim()) return;
    try {
      const res = await API.post("message/sendmessage", req);
      const newMessage = res.data.newMessage;
      setReq({ ...req, content: "" });
      // Emit via socket so receiver gets it in real time
      socket.emit("sendMessage", { receiverId: partner, message: newMessage });
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  // Empty State
  if (!partner) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50 text-slate-400 select-none">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-slate-600">Select a conversation</p>
          <p className="text-sm mt-1 text-slate-400">Choose from your inbox to start messaging</p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString("en-US", {
      weekday: "long", month: "short", day: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 md:px-6 py-3.5 bg-white border-b border-slate-200 shadow-sm">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {partnerData?.avatar ? (
            <img src={partnerData.avatar} alt="profile" className="w-full h-full object-cover" />
          ) : (
            partnerData?.username?.[0]?.toUpperCase() ?? "?"
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 leading-none">
            {partnerData?.username || "Conversation"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-1">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
            <p className="text-sm">No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              {/* Date Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium px-2 whitespace-nowrap">{date}</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {msgs.map((message) => {
                const senderId =
                  typeof message.sender === "object"
                    ? message.sender._id
                    : message.sender;
                const isSender = senderId === currentUser._id;
                const seen = isSender ? (message.seen ? "✓✓" : "✓") : "";

                return (
                  <div
                    key={message._id}
                    className={`msg-bubble flex items-end gap-2 mb-3 ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    {/* Receiver avatar */}
                    {!isSender && (
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {message.sender?.avatar
                          ? <img src={message.sender.avatar} alt="avatar" className="w-full h-full object-cover" />
                          : message.sender?.username?.[0]?.toUpperCase()
                        }
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={`max-w-[75%] sm:max-w-[60%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      isSender
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-slate-800 rounded-bl-sm border border-slate-100"
                    }`}>
                      <p className="leading-relaxed break-words">{message.content}</p>
                      <div className={`flex items-center gap-1 mt-1 text-xs ${isSender ? "text-blue-200 justify-end" : "text-slate-400"}`}>
                        <span>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {seen && <span className="font-medium">{seen}</span>}
                      </div>
                    </div>

                    {/* Sender avatar */}
                    {isSender && (
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {currentUser?.avatar
                          ? <img src={currentUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                          : currentUser?.username?.[0]?.toUpperCase()
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 md:px-6 py-3 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:bg-white transition-all duration-200 border border-transparent focus-within:border-blue-200">
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={req.content}
            onChange={handleChange}
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none py-1"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!req.content.trim()}
            className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-center text-slate-400 mt-2">Press Enter to send</p>
      </div>
    </div>
  );
};

export default Conversation;