import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { deletePost } from "../api/postApi";
import { getJobPostDetail } from "../api/jobPostApi";
import type { JobPostDetail } from "../types/job";
import { useToast } from "../contexts/ToastContext";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function getJobTypeLabel(jobType: JobPostDetail["jobType"]) {
  return jobType === "PART_TIME" ? "파트타임" : "풀타임";
}

function getPayLabel(jobType: JobPostDetail["jobType"]) {
  return jobType === "PART_TIME" ? "시급" : "연봉";
}

function JobDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [post, setPost] = useState<JobPostDetail | null>(null);
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
        const data = await getJobPostDetail(Number(postId));
        setPost(data);
      } catch (fetchError) {
        console.error(fetchError);
        setError("구직 글을 불러오는 중 오류가 발생했습니다.");
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
      await deletePost(post.postId);
      showToast("구직 글이 삭제되었습니다.");
      navigate("/job");
    } catch (deleteError) {
      console.error(deleteError);
      showToast("구직 글 삭제 중 오류가 발생했습니다.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-5xl px-6 py-12">
        {loading && (
          <div className="rounded-3xl border border-slate-300 bg-white px-6 py-10 text-center text-slate-700 shadow-sm">
            구직 글을 불러오는 중입니다...
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
                  {getJobTypeLabel(post.jobType)}
                </span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  {post.position}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                {post.title}
              </h1>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div>
                  <strong className="mr-2 text-slate-900">위치</strong>
                  {post.location}
                </div>
                <div>
                  <strong className="mr-2 text-slate-900">
                    {getPayLabel(post.jobType)}
                  </strong>
                  £{post.pay}
                </div>
                <div>
                  <strong className="mr-2 text-slate-900">포지션</strong>
                  {post.position}
                </div>
                <div>
                  <strong className="mr-2 text-slate-900">작성일</strong>
                  {formatDate(post.createdAt)}
                </div>
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
                onClick={() => navigate("/job")}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                목록으로
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/job-posts/${post.postId}/edit`)}
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
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default JobDetailPage;
