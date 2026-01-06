import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { storage } from "../services/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const DEFAULT_MESSAGES = [
  {
    id: 1,
    student: "Nimal Perera",
    studentId: "ST001",
    subject: "Payment Issue",
    message: "Sir, my payment is still pending. Can you check?",
    status: "Unread",
    thread: []
  },
  {
    id: 2,
    student: "Kavindu Silva",
    studentId: "ST002",
    subject: "Class Time",
    message: "What time is the math class tomorrow?",
    status: "Read",
    thread: []
  }
];

const Messages = () => {
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const saved = storage.getMessages();
    if (saved && Array.isArray(saved)) setMessages(saved);
    else storage.saveMessages(DEFAULT_MESSAGES);
  }, []);

  const selectMessage = (m) => {
    const updated = messages.map((x) => (x.id === m.id ? { ...x, status: "Read" } : x));
    setMessages(updated);
    storage.saveMessages(updated);
    setSelected({ ...m, status: "Read" });
  };

  const sendReply = () => {
    if (!selected || !reply.trim()) return;

    const updated = messages.map((m) => {
      if (m.id !== selected.id) return m;
      return {
        ...m,
        thread: [
          ...m.thread,
          {
            id: `R-${Date.now()}`,
            from: "Admin",
            text: reply.trim(),
            at: new Date().toISOString()
          }
        ]
      };
    });

    setMessages(updated);
    storage.saveMessages(updated);
    setReply("");
    alert("Reply sent (UI only)");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white border rounded-xl p-4 space-y-3">
        <SectionHeader title="Messages" subtitle="Student inquiries & replies" />

        {messages.map((m) => (
          <div
            key={m.id}
            onClick={() => selectMessage(m)}
            className="cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
          >
            <div className="flex justify-between items-center gap-2">
              <p className="font-medium text-sm text-gray-900">{m.student}</p>
              <Badge variant={m.status === "Unread" ? "warning" : "neutral"}>{m.status}</Badge>
            </div>
            <p className="text-xs text-gray-500">{m.subject}</p>
          </div>
        ))}
      </div>

      <div className="lg:col-span-2 bg-white border rounded-xl p-6">
        {selected ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900">{selected.subject}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {selected.student} ({selected.studentId})
            </p>

            <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-800">
              {selected.message}
            </div>

            <div className="mt-4 space-y-2">
              {(messages.find((x) => x.id === selected.id)?.thread || []).map((t) => (
                <div key={t.id} className="rounded-lg border border-gray-200 p-3">
                  <div className="text-xs text-gray-500">{t.from} • {new Date(t.at).toLocaleString()}</div>
                  <div className="text-sm text-gray-900 mt-1">{t.text}</div>
                </div>
              ))}
            </div>

            <textarea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply..."
              className="mt-4 w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-blue-500"
            />

            <div className="mt-3 flex justify-end">
              <Button variant="primary" onClick={sendReply} disabled={!reply.trim()}>
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                Send Reply
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">Select a message to view and reply.</p>
        )}
      </div>
    </div>
  );
};

export default Messages;
