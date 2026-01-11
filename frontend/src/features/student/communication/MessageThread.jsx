import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../../api/api";

const MessageThread = () => {
  const { messageId } = useParams();
  const [thread, setThread] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await apiFetch(`/api/student/messages/${messageId}`);
      setThread(res);

      // refresh sidebar + inbox
      window.dispatchEvent(new Event("messages-updated"));
    };
    load();
  }, [messageId]);

  if (!thread) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl space-y-4">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-lg font-semibold">{thread.subject}</h1>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="text-xs font-semibold text-slate-500">You</div>
        <p className="mt-2 text-sm text-slate-800">{thread.message}</p>
      </div>
    </div>
  );
};

export default MessageThread;
