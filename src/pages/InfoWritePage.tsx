import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { createPost } from "../api/postApi";
import { useToast } from "../contexts/ToastContext";
import CountrySelect from "../components/common/CountrySelect";
import { COUNTRY_OPTIONS } from "../constants/countries";

function InfoWritePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const selectedCountry = useMemo(
    () => COUNTRY_OPTIONS.find((country) => country.code === countryCode),
    [countryCode],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!countryCode) {
      setError("나라를 선택해주세요.");
      return;
    }

    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const postId = await createPost({
        userId: 1,
        category: "INFO",
        title: title.trim(),
        content: content.trim(),
        location: "정보게시판",
        countryCode: countryCode,
        countryName: selectedCountry?.name ?? "",
      });

      showToast("정보게시판 글이 등록되었습니다.");
      navigate(`/info-posts/${postId}`);
    } catch (submitError) {
      console.error(submitError);
      setError("정보게시판 글 등록 중 오류가 발생했습니다.");
      showToast("정보게시판 글 등록 중 오류가 발생했습니다.", "error");
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
            정보게시판 글쓰기
          </h1>
          <p className="mt-3 text-base text-slate-700">
            워홀, 비자, 정착, 생활 정보를 자유롭게 공유해보세요.
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
                placeholder="제목을 입력하세요"
              />
            </div>

            <CountrySelect value={countryCode} onChange={setCountryCode} />

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                내용
              </label>
              <textarea
                rows={12}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                placeholder="내용을 입력하세요"
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

export default InfoWritePage;
