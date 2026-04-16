import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { getChatMessages, sendChatMessage } from "../api/chatApi";
import type { ChatMessageItem } from "../types/chat";
import { getStoredUser } from "../utils/authStorage";
import { formatChatTime } from "../utils/chatFormat";
import { useToast } from "../contexts/ToastContext";

function ChatRoomPage() {
  const { roomId } = useParams();
  const { showToast } = useToast();
  const currentUser = getStoredUser();

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const numericRoomId = useMemo(() => Number(roomId), [roomId]);

  async function fetchMessages() {
    if (!numericRoomId || Number.isNaN(numericRoomId)) return;

    try {
      const data = await getChatMessages(numericRoomId);
      setMessages(data);
    } catch (err) {
      console.error(err);
      setError("채팅 메시지를 불러오는 중 오류가 발생했습니다.");
    }
  }

  useEffect(() => {
    async function init() {
      if (!numericRoomId || Number.isNaN(numericRoomId)) {
        setError("잘못된 채팅방입니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        await fetchMessages();
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [numericRoomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!numericRoomId || Number.isNaN(numericRoomId)) return;
    if (!input.trim()) return;

    try {
      setIsSending(true);
      await sendChatMessage(numericRoomId, input.trim());
      setInput("");
      await fetchMessages();
    } catch (err) {
      console.error(err);
      showToast("메시지 전송에 실패했습니다.", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-slate-950">채팅방</h1>
          </div>

          {loading && (
            <div className="px-6 py-10 text-center text-slate-700">
              메시지를 불러오는 중입니다...
            </div>
          )}

          {!loading && error && (
            <div className="px-6 py-10 text-center text-red-700">{error}</div>
          )}

          {!loading && !error && (
            <>
              <div className="h-[520px] overflow-y-auto bg-slate-50 px-4 py-5">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isMine =
                      message.senderUserId != null &&
                      currentUser?.userId === message.senderUserId;

                    if (message.messageType === "SYSTEM") {
                      return (
                        <div
                          key={message.messageId}
                          className="text-center text-xs font-medium text-slate-500"
                        >
                          {message.content}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={message.messageId}
                        className={`flex ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                            isMine
                              ? "bg-slate-900 text-white"
                              : "bg-white text-slate-900"
                          }`}
                        >
                          {!isMine && (
                            <div className="mb-1 text-xs font-semibold text-slate-500">
                              {message.senderNickname}
                            </div>
                          )}

                          <div className="whitespace-pre-wrap text-sm leading-6">
                            {message.content}
                          </div>

                          <div
                            className={`mt-2 text-right text-[11px] ${
                              isMine ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            {formatChatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              </div>

              <div className="border-t border-slate-200 bg-white px-4 py-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleSend();
                      }
                    }}
                    placeholder="메시지를 입력하세요"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() => void handleSend()}
                    disabled={isSending || !input.trim()}
                    className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    전송
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default ChatRoomPage;
