import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostListTable from "../components/post/PostListTable";
import Pagination from "../components/post/Pagination";
import MainLayout from "../components/layout/MainLayout";
import { getPostsByCategory } from "../api/postApi";
import type { PostPageResponse } from "../types/post";

function DonghaengPage() {
  const navigate = useNavigate();

  const [data, setData] = useState<PostPageResponse | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError("");

        const result = await getPostsByCategory("DONGHANG", page, 10);
        setData(result);
      } catch (err) {
        console.error(err);
        setError("동행 게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [page]);

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            {/* <p className="mb-2 text-sm font-semibold text-sky-700">Board</p> */}
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              동행
            </h1>
            <p className="mt-3 text-base text-slate-700">
              해외에서 함께 여행하거나 일정을 맞출 사람을 찾아보세요.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/donghang/write")}
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

        {!loading && !error && data?.content.length === 0 && (
          <div className="rounded-3xl border border-slate-300 bg-white px-6 py-10 text-center text-slate-700 shadow-sm">
            아직 등록된 동행 글이 없습니다.
          </div>
        )}

        {!loading && !error && data && data.content.length > 0 && (
          <>
            <PostListTable
              posts={data.content}
              onClickPost={(postId) => navigate(`/posts/${postId}`)}
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

export default DonghaengPage;
