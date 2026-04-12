import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { getJobPostDetail, updateJobPost } from "../api/jobPostApi";
import type { JobPostDetail, JobType } from "../types/job";
import { useToast } from "../contexts/ToastContext";

function JobEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [post, setPost] = useState<JobPostDetail | null>(null);
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState<JobType>("PART_TIME");
  const [pay, setPay] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function fetchPost() {
      if (!postId) return;

      try {
        setLoading(true);
        const data = await getJobPostDetail(Number(postId));
        setPost(data);
        setTitle(data.title);
        setJobType(data.jobType);
        setPay(String(data.pay));
        setPosition(data.position);
        setLocation(data.location);
        setContent(data.content);
      } catch (e) {
        console.error(e);
        setError("구직 글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!postId) return;

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!position.trim()) {
      setError("포지션을 입력해주세요.");
      return;
    }

    if (!location.trim()) {
      setError("위치를 입력해주세요.");
      return;
    }

    if (!pay.trim()) {
      setError("페이를 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      setError("설명을 입력해주세요.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await updateJobPost(Number(postId), {
        title: title.trim(),
        content: content.trim(),
        location: location.trim(),
        jobType,
        pay: Number(pay),
        position: position.trim(),
      });

      showToast("구직 글이 수정되었습니다.");
      navigate(`/job-posts/${postId}`);
    } catch (e) {
      console.error(e);
      setError("구직 글 수정에 실패했습니다.");
      showToast("구직 글 수정에 실패했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="mx-auto max-w-4xl px-6 py-12">
          불러오는 중...
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-sky-700">Edit</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              구직 글 수정
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/job-posts/${postId}`)}
            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            취소
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm"
        >
          <div className="space-y-6">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              placeholder="제목"
            />

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setJobType("PART_TIME")}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  jobType === "PART_TIME"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-800"
                }`}
              >
                파트타임
              </button>

              <button
                type="button"
                onClick={() => setJobType("FULL_TIME")}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  jobType === "FULL_TIME"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-800"
                }`}
              >
                풀타임
              </button>
            </div>

            <input
              type="number"
              value={pay}
              onChange={(e) => setPay(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              placeholder={jobType === "PART_TIME" ? "시급" : "연봉"}
            />

            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              placeholder="포지션"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              placeholder="위치"
            />

            <textarea
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              placeholder="설명"
            />

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                {isSubmitting ? "수정 중..." : "수정하기"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </MainLayout>
  );
}

export default JobEditPage;
