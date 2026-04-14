import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import CommentSection from "../components/comment/CommentSection";
import { deletePost, getPostDetail } from "../api/postApi";
import type { PostDetail } from "../types/post";
import { useToast } from "../contexts/ToastContext";
import { getStoredUser } from "../utils/authStorage";

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

function InfoDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const currentUser = getStoredUser();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!postId) {
        setError("잘못된 접근입니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getPostDetail(Number(postId));
        setPost(data);
        setIsOwner(currentUser?.userId === data.userId);
      } catch (fetchError) {
        console.error(fetchError);
        setError("정보게시판 글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!post) return;

    const confirmed = window.confirm("정말 이 글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deletePost(post.id);
      showToast("정보게시판 글이 삭제되었습니다.");
      navigate("/info");
    } catch (deleteError) {
      console.error(deleteError);
      showToast("정보게시판 글 삭제 중 오류가 발생했습니다.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-5xl px-6 py-12">
        {loading && (
          <div className="rounded-3xl border border-slate-300 bg-white px-6 py-10 text-center text-slate-700 shadow-sm">
            글을 불러오는 중입니다...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && post && (
          <>
            <div className="rounded-3xl border border-slate-300 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-6 md:px-8">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    정보게시판
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                  {post.title}
                </h1>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700">
                  <span>
                    <strong className="mr-1 text-slate-900">작성자</strong>
                    {post.nickname}
                  </span>
                  <span>
                    <strong className="mr-1 text-slate-900">조회수</strong>
                    {post.viewCnt}
                  </span>
                  <span>
                    <strong className="mr-1 text-slate-900">작성일</strong>
                    {formatDateTime(post.createdAt)}
                  </span>
                </div>
              </div>

              <div className="min-h-[320px] whitespace-pre-wrap px-6 py-8 text-base leading-8 text-slate-800 md:px-8">
                {post.content}
              </div>

              <div className="flex flex-wrap justify-between gap-3 border-t border-slate-200 px-6 py-5 md:px-8">
                <button
                  type="button"
                  onClick={() => navigate("/info")}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  목록으로
                </button>

                {isOwner && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/info-posts/${post.id}/edit`)}
                      className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                    >
                      수정하기
                    </button>

                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
                    >
                      {isDeleting ? "삭제 중..." : "삭제하기"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <CommentSection postId={post.id} />
          </>
        )}
      </section>
    </MainLayout>
  );
}

export default InfoDetailPage;
