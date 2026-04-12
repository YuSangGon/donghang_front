import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import GooglePlacePickerWithMap from "../components/rent/GooglePlacePickerWithMap";
import ImageUploader from "../components/rent/ImgaeUploader";
import { getRentPostDetail, updateRentPost } from "../api/rentPostApi";
import type {
  RentFeeUnit,
  RentOfferType,
  RentPostDetail,
  RentStayType,
} from "../types/rent";
import { useToast } from "../contexts/ToastContext";

function RentEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [post, setPost] = useState<RentPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [offerType, setOfferType] = useState<RentOfferType>("RENT");
  const [stayType, setStayType] = useState<RentStayType>("LONG_TERM");

  const [address, setAddress] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [rentFee, setRentFee] = useState("");
  const [rentFeeUnit, setRentFeeUnit] = useState<RentFeeUnit>("MONTH");
  const [deposit, setDeposit] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [minimumStay, setMinimumStay] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");

  const [budget, setBudget] = useState("");
  const [preferredMoveInDate, setPreferredMoveInDate] = useState("");
  const [preferredStayDuration, setPreferredStayDuration] = useState("");

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPost() {
      if (!postId) return;

      try {
        setLoading(true);
        const data = await getRentPostDetail(Number(postId));
        setPost(data);

        setTitle(data.title);
        setContent(data.content);
        setOfferType(data.offerType);
        setStayType(data.stayType);

        setAddress(data.address);
        setPlaceId(data.placeId);
        setLat(data.lat);
        setLng(data.lng);

        setRentFee(data.rentFee ? String(data.rentFee) : "");
        setRentFeeUnit(data.rentFeeUnit ?? "MONTH");
        setDeposit(data.deposit ? String(data.deposit) : "");
        setAvailableFrom(data.availableFrom ?? "");
        setMinimumStay(data.minimumStay ?? "");
        setNoticePeriod(data.noticePeriod ?? "");

        setBudget(data.budget ? String(data.budget) : "");
        setPreferredMoveInDate(data.preferredMoveInDate ?? "");
        setPreferredStayDuration(data.preferredStayDuration ?? "");

        setImageUrls(data.imageUrls ?? []);
      } catch (e) {
        console.error(e);
        setError("렌트 글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  const handleSelectPlace = useCallback(
    ({
      address,
      placeId,
      lat,
      lng,
    }: {
      address: string;
      placeId: string;
      lat: number;
      lng: number;
    }) => {
      setAddress(address);
      setPlaceId(placeId);
      setLat(lat);
      setLng(lng);
    },
    [],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!postId || lat == null || lng == null) return;

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!address.trim()) {
      setError("위치를 선택해주세요.");
      return;
    }

    if (!content.trim()) {
      setError("설명을 입력해주세요.");
      return;
    }

    if (offerType === "RENT" && !rentFee.trim()) {
      setError("렌트 비용을 입력해주세요.");
      return;
    }

    if (offerType === "WANTED" && !budget.trim()) {
      setError("예산을 입력해주세요.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await updateRentPost(Number(postId), {
        title: title.trim(),
        content: content.trim(),
        offerType,
        address,
        placeId,
        lat,
        lng,
        stayType,
        rentFee: offerType === "RENT" ? Number(rentFee) : undefined,
        rentFeeUnit: offerType === "RENT" ? rentFeeUnit : undefined,
        deposit:
          offerType === "RENT" && deposit.trim() ? Number(deposit) : undefined,
        availableFrom: offerType === "RENT" ? availableFrom : undefined,
        minimumStay: offerType === "RENT" ? minimumStay.trim() : undefined,
        noticePeriod: offerType === "RENT" ? noticePeriod.trim() : undefined,
        budget: offerType === "WANTED" ? Number(budget) : undefined,
        preferredMoveInDate:
          offerType === "WANTED" ? preferredMoveInDate : undefined,
        preferredStayDuration:
          offerType === "WANTED" ? preferredStayDuration.trim() : undefined,
        imageUrls: offerType === "RENT" ? imageUrls : [],
      });

      showToast("렌트 글이 수정되었습니다.");
      navigate(`/rent-posts/${postId}`);
    } catch (e) {
      console.error(e);
      setError("렌트 글 수정에 실패했습니다.");
      showToast("렌트 글 수정에 실패했습니다.", "error");
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
              렌트 글 수정
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/rent-posts/${postId}`)}
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
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                글 구분
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    offerType === "RENT"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-800"
                  }`}
                  disabled
                >
                  렌트
                </button>

                <button
                  type="button"
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    offerType === "WANTED"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-800"
                  }`}
                  disabled
                >
                  구함
                </button>
              </div>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              placeholder="제목"
            />

            <GooglePlacePickerWithMap onSelect={handleSelectPlace} />

            {address && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                현재 위치: {address}
              </div>
            )}

            <select
              value={stayType}
              onChange={(e) => setStayType(e.target.value as RentStayType)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <option value="LONG_TERM">장기</option>
              <option value="SHORT_TERM">단기</option>
              {offerType === "RENT" && <option value="FLEXIBLE">장단기</option>}
            </select>

            {offerType === "RENT" && (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  <input
                    type="number"
                    value={rentFee}
                    onChange={(e) => setRentFee(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                    placeholder="렌트 비용"
                  />

                  <select
                    value={rentFeeUnit}
                    onChange={(e) =>
                      setRentFeeUnit(e.target.value as RentFeeUnit)
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  >
                    <option value="WEEK">주</option>
                    <option value="MONTH">월</option>
                    <option value="YEAR">년</option>
                  </select>
                </div>

                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  placeholder="Deposit"
                />

                <input
                  type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                />

                <input
                  value={minimumStay}
                  onChange={(e) => setMinimumStay(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  placeholder="Minimum stay"
                />

                <input
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  placeholder="Notice period"
                />

                <ImageUploader imageUrls={imageUrls} onChange={setImageUrls} />
              </>
            )}

            {offerType === "WANTED" && (
              <>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  placeholder="예산"
                />

                <input
                  type="date"
                  value={preferredMoveInDate}
                  onChange={(e) => setPreferredMoveInDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                />

                <input
                  value={preferredStayDuration}
                  onChange={(e) => setPreferredStayDuration(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  placeholder="희망 거주기간"
                />
              </>
            )}

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

export default RentEditPage;
