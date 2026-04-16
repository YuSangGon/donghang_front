import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { deletePost } from "../api/postApi";
import { getMarketPostDetail } from "../api/marketPostApi";
import type { MarketPostDetail } from "../types/market";
import { useToast } from "../contexts/ToastContext";
import { getStoredUser } from "../utils/authStorage";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function getMarketTypeLabel(type: MarketPostDetail["marketType"]) {
  return type === "SELL" ? "판매" : "구함";
}

function MarketDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [post, setPost] = useState<MarketPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
        const data = await getMarketPostDetail(Number(postId));
        setPost(data);
      } catch (fetchError) {
        console.error(fetchError);
        setError("중고 글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  const currentUser = getStoredUser();
  const isOwner = currentUser?.userId === post?.userId;

  const handleDelete = async () => {
    if (!post) return;

    const confirmed = window.confirm("정말 이 글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deletePost(post.postId);
      showToast("중고 글이 삭제되었습니다.");
      navigate("/market");
    } catch (deleteError) {
      console.error(deleteError);
      showToast("중고 글 삭제 중 오류가 발생했습니다.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-5xl px-6 py-12">
        {loading && (
          <div className="rounded-3xl border border-slate-300 bg-white px-6 py-10 text-center text-slate-700 shadow-sm">
            중고 글을 불러오는 중입니다...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && post && (
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {getMarketTypeLabel(post.marketType)}
                </span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  {post.itemName}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                {post.title}
              </h1>

              <div className="mt-5 grid gap-4 text-sm text-slate-700 md:grid-cols-2">
                <div>
                  <strong className="mr-2 text-slate-900">나라</strong>
                  {post.countryName}
                </div>
                <div>
                  <strong className="mr-2 text-slate-900">위치</strong>
                  {post.location}
                </div>
                <div>
                  <strong className="mr-2 text-slate-900">작성자</strong>
                  {post.nickname}
                </div>
                <div>
                  <strong className="mr-2 text-slate-900">작성일</strong>
                  {formatDate(post.createdAt)}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-5">
                <div className="text-sm text-slate-500">
                  {post.marketType === "SELL" ? "판매 가격" : "희망 가격"}
                </div>
                <div className="mt-1 text-3xl font-bold text-slate-950">
                  {post.price != null ? `£${post.price}` : "가격 미기재"}
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-700">
                {post.marketType === "SELL" && (
                  <>
                    <div>
                      <strong className="mr-2 text-slate-900">상태</strong>
                      {post.condition || "-"}
                    </div>
                    <div>
                      <strong className="mr-2 text-slate-900">연락 방법</strong>
                      {post.contact || "-"}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-slate-950">설명</h2>
              <div className="whitespace-pre-wrap text-base leading-8 text-slate-800">
                {post.content}
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate("/market")}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                목록으로
              </button>

              {isOwner && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/market-posts/${post.postId}/edit`)
                    }
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
        )}
      </section>
    </MainLayout>
  );
}

export default MarketDetailPage;
