import React, {
    useEffect,
    useMemo,
    useState,
    useCallback,
    useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../../api/api";

/* ================= DATE FORMAT ================= */
const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "-";

    return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

/* ================= MESSAGE BUBBLE ================= */
const Bubble = ({ mine, role, text, time }) => (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
        <div
            className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                mine
                    ? "bg-blue-900 text-white"
                    : "bg-slate-100 text-slate-900"
            }`}
        >
            <div className="mb-1 text-[11px] font-semibold opacity-70">
                {role}
            </div>

            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {text}
            </div>

            <div className="mt-2 text-[11px] opacity-60 text-right">
                {time}
            </div>
        </div>
    </div>
);

export default function TeacherMessageThread() {
    const { threadId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);
    const [closing, setClosing] = useState(false);
    const [error, setError] = useState("");

    const bottomRef = useRef(null);

    const load = useCallback(async () => {
        try {
            const res = await apiFetch(`/api/teacher/messages/${threadId}`);
            setData(res);
        } catch {
            setError("Failed to load conversation");
        }
    }, [threadId]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        const i = setInterval(load, 5000);
        return () => clearInterval(i);
    }, [load]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data?.messages]);

    const messages = useMemo(() => {
        return [...(data?.messages || [])].reverse();
    }, [data]);

    if (!data && !error) {
        return <div className="p-6 text-sm text-slate-500">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-sm text-red-600">{error}</div>;
    }

    const thread = data.thread;
    const isClosed = thread.status === "COMPLETED";

    const onSend = async () => {
        if (!reply.trim() || isClosed) return;

        setSending(true);
        try {
            await apiFetch(`/api/teacher/messages/${threadId}/reply`, {
                method: "POST",
                body: JSON.stringify({ message: reply.trim() }),
            });
            setReply("");
            await load();
        } finally {
            setSending(false);
        }
    };

    const closeChat = async () => {
        if (isClosed) return;

        setClosing(true);
        try {
            await apiFetch(`/api/teacher/messages/${threadId}/close`, {
                method: "POST",
            });
            await load();
        } finally {
            setClosing(false);
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-6">
            {/* HEADER */}
            <div className="mb-5 flex items-center justify-between">
                <button
                    onClick={() => navigate("/teacher/messages")}
                    className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold"
                >
                    Back
                </button>

                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {thread.status}
                    </span>

                    <button
                        onClick={closeChat}
                        disabled={closing || isClosed}
                        className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                        {isClosed ? "Closed" : "Close Chat"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* STUDENT INFO */}
                <div >
                    <div className="text-xs text-slate-500">Student</div>
                    <div className="text-lg font-semibold">
                        {thread.student_name}
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Student ID</span>
                            <span>{thread.student_id}</span>
                        </div>
                        
                    </div>
                </div>

                {/* CHAT */}
                <div className="lg:col-span-3 flex flex-col rounded-2xl border bg-white">
                    <div className="border-b px-6 py-4">
                        <div className="font-semibold">Conversation</div>
                        <div className="text-xs text-slate-500">
                            Live updates every 5 seconds
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
                        {messages.map((m) => (
                            <Bubble
                                key={m.id}
                                mine={m.sender_role === "TEACHER"}
                                role={m.sender_role}
                                text={m.message}
                                time={formatDateTime(m.sent_at)}
                            />
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <div className="border-t p-4">
                        {isClosed && (
                            <div className="mb-2 text-xs font-semibold text-red-600">
                                This conversation is closed
                            </div>
                        )}

                        <div className="flex gap-3">
                            <textarea
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                disabled={isClosed}
                                placeholder="Write your reply..."
                                className="flex-1 rounded-xl border px-4 py-2 text-sm"
                            />
                            <button
                                onClick={onSend}
                                disabled={
                                    sending || isClosed || !reply.trim()
                                }
                                className="rounded-xl bg-blue-700 px-5 py-2 text-sm text-white disabled:opacity-200"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
