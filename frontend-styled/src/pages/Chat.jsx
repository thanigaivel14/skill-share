import Inbox from "../components/Inbox";
import Conversation from "../components/Conversation";
import { useEffect, useState } from "react";
import API from "../api";

const Chat = () => {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await API.get("message/inbox");
        if (res.data?.inbox) {
          setInbox(res.data.inbox);
        }
      } catch (error) {
        console.error("Error fetching inbox:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, [expanded]);

  const handleSelectPartner = (user) => {
    setPartner(user);
    setExpanded(true);
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden">
      {/* Sidebar — hidden on mobile when a chat is open */}
      <aside
        className={`
          flex-shrink-0 bg-white border-r border-slate-200
          flex flex-col
          transition-all duration-300 ease-in-out
          ${expanded
            ? "w-0 overflow-hidden md:w-[300px] lg:w-[320px]"
            : "w-full md:w-[300px] lg:w-[320px]"
          }
        `}
      >
        <Inbox inbox={inbox} loading={loading} setPartner={handleSelectPartner} />
      </aside>

      {/* Main conversation pane */}
      <main
        className={`
          relative flex flex-col flex-1 min-w-0 h-full
          transition-all duration-300
          ${expanded ? "flex" : "hidden md:flex"}
        `}
      >
        {/* Back button – mobile only */}
        {expanded && (
          <button
            onClick={() => setExpanded(false)}
            className="md:hidden absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <Conversation partner={partner} />
      </main>
    </div>
  );
};

export default Chat;
