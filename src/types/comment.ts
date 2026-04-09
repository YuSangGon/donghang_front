export interface CommentItem {
  id: number;
  postId: number;
  userId: number;
  nickname: string;
  parentCommentId: number | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}
