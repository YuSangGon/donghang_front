export type ChatRoomType = "DIRECT_INQUIRY" | "GROUP_COMPANION";
export type ChatMessageType = "TEXT" | "SYSTEM";

export interface ChatRoomItem {
  roomId: number;
  roomType: ChatRoomType;
  postId: number;
  title: string;
  maxParticipants?: number | null;
  currentParticipants: number;
  closed: boolean;
}

export interface ChatMessageItem {
  messageId: number;
  roomId: number;
  senderUserId?: number | null;
  senderNickname?: string | null;
  messageType: ChatMessageType;
  content: string;
  createdAt: string;
}

export interface JoinChatRoomResponse {
  roomId: number;
  joined: boolean;
}
