import { useEffect, useState } from "react";
import {
  createComment,
  deleteComment,
  getComments,
} from "../../api/commentApi";
import type { CommentItem } from "../../types/comment";
import { useToast } from "../../contexts/ToastContext";

interface CommentSectionProps {
  postId: number;
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function CommentSection({ postId }: CommentSectionProps) {
  const { showToast } = useToast();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCommentList = async () => {
    try {
      setLoading(true);
      const data = await getComments(postId);
      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommentList();
  }, [postId]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);

      await createComment(postId, {
        userId: 1,
        parentCommentId: null,
        content: content.trim(),
      });

      setContent("");
      await fetchCommentList();
      showToast("댓글이 등록되었습니다.");
    } catch (error) {
      console.error(error);
      showToast("댓글 등록 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    const confirmed = window.confirm("이 댓글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await deleteComment(commentId);
      await fetchCommentList();
      showToast("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error(error);
      showToast("댓글 삭제 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <section className="mt-8 rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-950">댓글</h2>
      </div>

      <div className="mb-6">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
          placeholder="댓글을 입력하세요"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
        />

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {isSubmitting ? "등록 중..." : "댓글 등록"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-slate-700">댓글을 불러오는 중입니다...</div>
      )}

      {!loading && comments.length === 0 && (
        <div className="text-slate-700">아직 댓글이 없습니다.</div>
      )}

      {!loading && comments.length > 0 && (
        <ul className="divide-y divide-slate-200">
          {comments.map((comment) => (
            <li key={comment.id} className="py-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-slate-900">
                    {comment.nickname}
                  </span>
                  <span className="text-sm text-slate-600">
                    {formatDateTime(comment.createdAt)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(comment.id)}
                  className="text-sm font-semibold text-red-600 hover:text-red-500"
                >
                  삭제
                </button>
              </div>

              <p className="whitespace-pre-wrap text-slate-800">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default CommentSection;
