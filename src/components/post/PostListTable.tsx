import type { PostListItem } from "../../types/post";
import { getRentOfferTypeLabel } from "../../utils/rentLabel";
import { getJobTypeLabel } from "../../utils/jobLabel";

interface PostListTableProps {
  posts: PostListItem[];
  onClickPost?: (postId: number) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function PostListTable({ posts, onClickPost }: PostListTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-sm">
      <div className="grid grid-cols-[100px_minmax(0,1fr)_110px_90px_120px] border-b border-slate-300 bg-slate-100 px-5 py-3 text-sm font-bold text-slate-900">
        <span>나라</span>
        <span>제목</span>
        <span>작성자</span>
        <span>조회수</span>
        <span>작성일</span>
      </div>

      <ul className="divide-y divide-slate-200">
        {posts.map((post) => {
          const rentLabel =
            post.category === "RENT"
              ? getRentOfferTypeLabel(post.offerType)
              : "";

          const jobLabel =
            post.category === "JOB" ? getJobTypeLabel(post.jobType) : "";

          const badgeLabel = rentLabel || jobLabel;

          return (
            <li
              key={post.id}
              className="grid grid-cols-[100px_minmax(0,1fr)_110px_90px_120px] items-center px-5 py-4 text-sm text-slate-800 transition hover:bg-slate-50"
            >
              <span className="font-medium text-slate-700">
                {post.countryName}
              </span>

              <button
                type="button"
                onClick={() => onClickPost?.(post.id)}
                className="truncate text-left font-semibold text-slate-900 hover:underline"
              >
                {badgeLabel && (
                  <span className="mr-2 rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                    {badgeLabel}
                  </span>
                )}
                {post.title}
              </button>

              <span className="truncate text-slate-700">{post.nickname}</span>
              <span className="text-slate-700">{post.viewCnt}</span>
              <span className="text-slate-700">
                {formatDate(post.createdAt)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PostListTable;
