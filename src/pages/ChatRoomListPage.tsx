import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { getMyChatRooms } from "../api/chatApi";
import type { ChatRoomItem } from "../types/chat";

function getRoomTypeLabel(type: ChatRoomItem["roomType"]) {
  return type === "DIRECT_INQUIRY" ? "문의 채팅" : "동행 채팅";
}

function ChatRoomListPage() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<ChatRoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true);
        setError("");
        const data = await getMyChatRooms();
        setRooms(data);
      } catch (err) {
        console.error(err);
        setError("채팅방 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  return (
    <MainLayout>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-sky-700">Chat</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            내 채팅방
          </h1>
          <p className="mt-3 text-base text-slate-700">
            참여 중인 채팅방을 확인해보세요.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-300 bg-white px-6 py-10 text-center text-slate-700 shadow-sm">
            채팅방 목록을 불러오는 중입니다...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="rounded-3xl border border-slate-300 bg-white px-6 py-10 text-center text-slate-700 shadow-sm">
            참여 중인 채팅방이 없습니다.
          </div>
        )}

        {!loading && !error && rooms.length > 0 && (
          <div className="space-y-4">
            {rooms.map((room) => (
              <button
                key={room.roomId}
                type="button"
                onClick={() => navigate(`/chat/rooms/${room.roomId}`)}
                className="block w-full rounded-3xl border border-slate-300 bg-white px-6 py-5 text-left shadow-sm transition hover:bg-slate-50"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {getRoomTypeLabel(room.roomType)}
                  </span>

                  {room.roomType === "GROUP_COMPANION" && (
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      {room.currentParticipants}
                      {room.maxParticipants ? ` / ${room.maxParticipants}` : ""}
                    </span>
                  )}

                  {room.closed && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                      종료됨
                    </span>
                  )}
                </div>

                <div className="text-lg font-bold text-slate-950">
                  {room.title}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default ChatRoomListPage;
