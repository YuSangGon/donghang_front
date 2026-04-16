import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import RentImageCarousel from "../components/rent/RentImageCarousel";
import GoogleMapView from "../components/rent/GoogleMapView";
import { deletePost } from "../api/postApi";
import { getRentPostDetail } from "../api/rentPostApi";
import type { RentPostDetail } from "../types/rent";
import { useToast } from "../contexts/ToastContext";
import { getStoredUser } from "../utils/authStorage";
import { createOrGetInquiryRoom } from "../api/chatApi";
import { isLoggedIn } from "../utils/authStorage";

function formatDate(dateString?: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function getOfferTypeLabel(type: RentPostDetail["offerType"]) {
  return type === "RENT" ? "렌트" : "구함";
}

function getStayTypeLabel(type: RentPostDetail["stayType"]) {
  switch (type) {
    case "LONG_TERM":
      return "장기";
    case "SHORT_TERM":
      return "단기";
    case "FLEXIBLE":
      return "장단기";
    default:
      return type;
  }
}

function getFeeUnitLabel(unit?: RentPostDetail["rentFeeUnit"]) {
  switch (unit) {
    case "WEEK":
      return "주";
    case "MONTH":
      return "월";
    case "YEAR":
      return "년";
    default:
      return "";
  }
}

function RentDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [post, setPost] = useState<RentPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const currentUser = getStoredUser();
  const [isOwner, setIsOwner] = useState(false);

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
        const data = await getRentPostDetail(Number(postId));
        setPost(data);
        setIsOwner(currentUser?.userId === data.userId);
      } catch (fetchError) {
        console.error(fetchError);
        setError("렌트 글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  const handleInquiry = async () => {
    if (!post) return;

    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      const roomId = await createOrGetInquiryRoom(post.postId);
      navigate(`/chat/rooms/${roomId}`);
    } catch (err) {
      console.error(err);
      showToast("문의 채팅방을 여는 중 오류가 발생했습니다.", "error");
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    const confirmed = window.confirm("정말 이 글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deletePost(post.postId);
      showToast("렌트 글이 삭제되었습니다.");
      navigate("/rent");
    } catch (deleteError) {
      console.error(deleteError);
      showToast("렌트 글 삭제 중 오류가 발생했습니다.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-6xl px-6 py-12">
        {loading && (
          <div className="rounded-3xl border border-slate-300 bg-white px-6 py-10 text-center text-slate-700 shadow-sm">
            렌트 글을 불러오는 중입니다...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && post && (
          <div className="space-y-8">
            {post.offerType === "RENT" && (
              <RentImageCarousel images={post.imageUrls} />
            )}

            <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {getOfferTypeLabel(post.offerType)}
                </span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  {getStayTypeLabel(post.stayType)}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                {post.title}
              </h1>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div>
                  <strong className="mr-2 text-slate-900">위치</strong>
                  {post.address}
                </div>

                {post.offerType === "RENT" ? (
                  <>
                    <div>
                      <strong className="mr-2 text-slate-900">렌트 비용</strong>
                      £{post.rentFee} / {getFeeUnitLabel(post.rentFeeUnit)}
                    </div>

                    <div>
                      <strong className="mr-2 text-slate-900">Deposit</strong>
                      {post.deposit ? `£${post.deposit}` : "-"}
                    </div>

                    <div>
                      <strong className="mr-2 text-slate-900">입주일</strong>
                      {formatDate(post.availableFrom)}
                    </div>

                    <div>
                      <strong className="mr-2 text-slate-900">
                        Minimum stay
                      </strong>
                      {post.minimumStay || "-"}
                    </div>

                    <div>
                      <strong className="mr-2 text-slate-900">
                        Notice period
                      </strong>
                      {post.noticePeriod || "-"}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <strong className="mr-2 text-slate-900">예산</strong>
                      {post.budget ? `£${post.budget}` : "-"}
                    </div>

                    <div>
                      <strong className="mr-2 text-slate-900">
                        희망 입주일
                      </strong>
                      {formatDate(post.preferredMoveInDate)}
                    </div>

                    <div>
                      <strong className="mr-2 text-slate-900">
                        희망 거주기간
                      </strong>
                      {post.preferredStayDuration || "-"}
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

            <div>
              <h2 className="mb-4 text-2xl font-bold text-slate-950">
                위치 지도
              </h2>
              <GoogleMapView
                lat={post.lat}
                lng={post.lng}
                title={post.address}
              />
            </div>

            <div className="flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate("/rent")}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                목록으로
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleInquiry}
                  className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
                >
                  문의하기
                </button>

                {isOwner && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/rent-posts/${post.postId}/edit`)
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default RentDetailPage;
