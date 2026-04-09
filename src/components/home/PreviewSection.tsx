import { useNavigate } from "react-router-dom";
import type { HomePostPreviewItem } from "../../types/post";

interface PreviewSectionProps {
  id: string;
  title: string;
  description: string;
  posts: HomePostPreviewItem[];
  moreLink?: string;
}

function PreviewSection({
  id,
  title,
  description,
  posts,
  moreLink,
}: PreviewSectionProps) {
  const navigate = useNavigate();

  return (
    <section
      id={id}
      className="rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm md:p-7"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-700">{description}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (moreLink) navigate(moreLink);
          }}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          더보기
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-300">
        <div className="grid grid-cols-[88px_minmax(0,1fr)_90px_80px] border-b border-slate-300 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
          <span>지역</span>
          <span>제목</span>
          <span>저자</span>
          <span>조회수</span>
        </div>

        <ul className="divide-y divide-slate-200">
          {posts.map((post) => (
            <li
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              className="grid cursor-pointer grid-cols-[88px_minmax(0,1fr)_90px_80px] items-center px-4 py-3 text-sm text-slate-800 transition hover:bg-slate-50"
            >
              <span className="font-medium text-slate-700">
                {post.location}
              </span>
              <span className="truncate font-medium text-slate-900">
                {post.title}
              </span>
              <span className="truncate text-slate-700">{post.nickname}</span>
              <span className="text-slate-700">{post.viewCnt}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PreviewSection;
