import { authFetch } from "./fetchClient";
import type {
  ChatMessageItem,
  ChatRoomItem,
  JoinChatRoomResponse,
} from "../types/chat";

const BASE_URL = "/api/chat";

export async function createOrGetInquiryRoom(postId: number): Promise<number> {
  const response = await authFetch(`${BASE_URL}/rooms/inquiry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId }),
  });

  if (!response.ok) {
    throw new Error("문의 채팅방 생성에 실패했습니다.");
  }

  const data: { roomId: number } = await response.json();
  return data.roomId;
}

export async function createCompanionRoom(
  postId: number,
  maxParticipants: number,
): Promise<number> {
  const response = await authFetch(
    `${BASE_URL}/rooms/companion/${postId}?maxParticipants=${maxParticipants}`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error("동행 채팅방 생성에 실패했습니다.");
  }

  const data: { roomId: number } = await response.json();
  return data.roomId;
}

export async function joinCompanionRoom(
  roomId: number,
): Promise<JoinChatRoomResponse> {
  const response = await authFetch(`${BASE_URL}/rooms/${roomId}/join`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("채팅방 참가에 실패했습니다.");
  }

  return response.json();
}

export async function getMyChatRooms(): Promise<ChatRoomItem[]> {
  const response = await authFetch(`${BASE_URL}/rooms/me`);

  if (!response.ok) {
    throw new Error("내 채팅방 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getChatMessages(
  roomId: number,
): Promise<ChatMessageItem[]> {
  const response = await authFetch(`${BASE_URL}/rooms/${roomId}/messages`);

  if (!response.ok) {
    throw new Error("채팅 메시지를 불러오지 못했습니다.");
  }

  return response.json();
}

export async function sendChatMessage(
  roomId: number,
  content: string,
): Promise<number> {
  const response = await authFetch(`${BASE_URL}/rooms/${roomId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("메시지 전송에 실패했습니다.");
  }

  const data: { messageId: number } = await response.json();
  return data.messageId;
}
