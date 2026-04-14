import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { createJobPost } from "../api/jobPostApi";
import type { JobType } from "../types/job";
import { useToast } from "../contexts/ToastContext";

function JobWritePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState<JobType>("PART_TIME");
  const [pay, setPay] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const payLabel = jobType === "PART_TIME" ? "시급" : "연봉";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      setError(`${payLabel}을 입력해주세요.`);
      return;
    }

    if (!content.trim()) {
      setError("설명을 입력해주세요.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const postId = await createJobPost({
        title: title.trim(),
        content: content.trim(),
        location: location.trim(),
        jobType,
        pay: Number(pay),
        position: position.trim(),
      });

      showToast("구직 글이 등록되었습니다.");
      navigate(`/job-posts/${postId}`);
    } catch (submitError) {
      console.error(submitError);
      setError("구직 글 등록 중 오류가 발생했습니다.");
      showToast("구직 글 등록 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-sky-700">Write</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            구직 글쓰기
          </h1>
          <p className="mt-3 text-base text-slate-700">
            채용 정보를 간단하고 명확하게 작성해보세요.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                placeholder="예: 런던 카페 파트타이머 구인"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                잡 구분
              </label>
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
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                {payLabel}
              </label>
              <input
                type="number"
                value={pay}
                onChange={(event) => setPay(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                placeholder={jobType === "PART_TIME" ? "예: 12.5" : "예: 32000"}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                포지션
              </label>
              <input
                type="text"
                value={position}
                onChange={(event) => setPosition(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                placeholder="예: Barista / Server / Frontend Developer"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                위치
              </label>
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                placeholder="예: London"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                설명
              </label>
              <textarea
                rows={10}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                placeholder="근무 조건, 우대사항, 지원 방법 등을 적어주세요"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {isSubmitting ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </MainLayout>
  );
}

export default JobWritePage;
