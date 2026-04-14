import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { getPostDetail, updatePost } from "../api/postApi";
import type { PostDetail } from "../types/post";
import { useToast } from "../contexts/ToastContext";
import CountrySelect from "../components/common/CountrySelect";
import { COUNTRY_OPTIONS } from "../constants/countries";

function InfoEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const selectedCountry = useMemo(
    () => COUNTRY_OPTIONS.find((country) => country.code === countryCode),
    [countryCode],
  );

  useEffect(() => {
    async function fetchPost() {
      if (!postId) return;

      try {
        setLoading(true);
        const data = await getPostDetail(Number(postId));
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (e) {
        console.error(e);
        setError("정보게시판 글을 불러오지 못했습니다.");
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

    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await updatePost(Number(postId), {
        title: title.trim(),
        content: content.trim(),
        location: "정보게시판",
        category: "INFO",
        countryCode: countryCode,
        countryName: selectedCountry?.name ?? "",
      });

      showToast("정보게시판 글이 수정되었습니다.");
      navigate(`/info-posts/${postId}`);
    } catch (e) {
      console.error(e);
      setError("정보게시판 글 수정에 실패했습니다.");
      showToast("정보게시판 글 수정에 실패했습니다.", "error");
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
              정보게시판 글 수정
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/info-posts/${postId}`)}
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

            <CountrySelect value={countryCode} onChange={setCountryCode} />

            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              placeholder="내용"
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

export default InfoEditPage;
