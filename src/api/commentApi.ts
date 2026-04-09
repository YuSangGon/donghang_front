import type { CommentItem } from "../types/comment";

const BASE_URL = "/api";

export interface CreateCommentRequest {
  userId: number;
  parentCommentId: number | null;
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export async function getComments(postId: number): Promise<CommentItem[]> {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);

  if (!response.ok) {
    throw new Error("댓글 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function createComment(
  postId: number,
  request: CreateCommentRequest,
): Promise<number> {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("댓글 작성에 실패했습니다.");
  }

  return response.json();
}

export async function updateComment(
  commentId: number,
  request: UpdateCommentRequest,
): Promise<number> {
  const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("댓글 수정에 실패했습니다.");
  }

  return response.json();
}

export async function deleteComment(commentId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("댓글 삭제에 실패했습니다.");
  }
}
