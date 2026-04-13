import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Pagination from "../components/post/Pagination";
import PostListTable from "../components/post/PostListTable";
import { getPostsByCategory } from "../api/postApi";
import type { PostCategory, PostPageResponse } from "../types/post";
import { getDetailPathByCategory } from "../utils/postRoute";
import { COUNTRY_OPTIONS } from "../constants/countries";

interface BoardPageProps {
  category: PostCategory;
  title: string;
  description: string;
  writePath: string;
}

function BoardPage({
  category,
  title,
  description,
  writePath,
}: BoardPageProps) {
  const navigate = useNavigate();

  const [data, setData] = useState<PostPageResponse | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const selectedCountry = useMemo(
    () => COUNTRY_OPTIONS.find((country) => country.code === countryCode),
    [countryCode],
  );

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError("");

        const result = await getPostsByCategory(
          category,
          page,
          10,
          countryCode,
          keyword,
        );
        setData(result);
      } catch (err) {
        console.error(err);
        setError(`${title} 게시글을 불러오는 중 오류가 발생했습니다.`);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [category, page, title]);

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            {/* <p className="mb-2 text-sm font-semibold text-sky-700">Board</p> */}
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              {title}
            </h1>
            <p className="mt-3 text-base text-slate-700">{description}</p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 rounded-3xl border border-slate-300 bg-white p-5 shadow-sm lg:grid-cols-[220px_minmax(0,1fr)_160px]">
          <select
            value={countryCode}
            onChange={(event) => {
              setCountryCode(event.target.value);
              setPage(0);
            }}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
          >
            <option value="">전체 나라</option>
            {COUNTRY_OPTIONS.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setKeyword(keywordInput.trim());
                setPage(0);
              }
            }}
            placeholder="제목, 내용, 위치로 검색"
            className="rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
          />

          <button
            type="button"
            onClick={() => {
              setKeyword(keywordInput.trim());
              setPage(0);
            }}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            검색
          </button>
        </div>

        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div />
          <button
            type="button"
            onClick={() => navigate(writePath)}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            글쓰기
          </button>
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-300 bg-white px-6 py-10 text-center text-slate-700 shadow-sm">
            게시글을 불러오는 중입니다...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && data && data.content.length === 0 && (
          <div className="rounded-3xl border border-slate-300 bg-white px-6 py-10 text-center text-slate-700 shadow-sm">
            아직 등록된 글이 없습니다.
          </div>
        )}

        {!loading && !error && data && data.content.length > 0 && (
          <>
            <PostListTable
              posts={data.content}
              onClickPost={(postId) =>
                navigate(getDetailPathByCategory(category, postId))
              }
            />

            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onChangePage={setPage}
            />
          </>
        )}
      </section>
    </MainLayout>
  );
}

export default BoardPage;
