import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { createRentPost } from "../api/rentPostApi";
import type { RentFeeUnit, RentOfferType, RentStayType } from "../types/rent";
import { useToast } from "../contexts/ToastContext";
import GooglePlacePickerWithMap from "../components/rent/GooglePlacePickerWithMap";
import ImageUploader from "../components/rent/ImgaeUploader";

function RentWritePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!address.trim() || lat == null || lng == null) {
      setError("구글 지도에서 위치를 선택해주세요.");
      return;
    }

    if (!content.trim()) {
      setError("설명을 입력해주세요.");
      return;
    }

    if (offerType === "RENT") {
      if (!rentFee.trim()) {
        setError("렌트 비용을 입력해주세요.");
        return;
      }

      if (!availableFrom) {
        setError("입주일을 입력해주세요.");
        return;
      }
    }

    if (offerType === "WANTED") {
      if (!budget.trim()) {
        setError("예산을 입력해주세요.");
        return;
      }

      if (!preferredMoveInDate) {
        setError("희망 입주일을 입력해주세요.");
        return;
      }
    }

    try {
      setError("");
      setIsSubmitting(true);

      const postId = await createRentPost({
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

      showToast("렌트 글이 등록되었습니다.");
      navigate(`/rent-posts/${postId}`);
    } catch (submitError) {
      console.error(submitError);
      setError("렌트 글 등록 중 오류가 발생했습니다.");
      showToast("렌트 글 등록 중 오류가 발생했습니다.", "error");
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
            렌트 글쓰기
          </h1>
          <p className="mt-3 text-base text-slate-700">
            렌트 또는 구함 글을 작성해보세요.
          </p>
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
                  onClick={() => setOfferType("RENT")}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    offerType === "RENT"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-800"
                  }`}
                >
                  렌트
                </button>

                <button
                  type="button"
                  onClick={() => setOfferType("WANTED")}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    offerType === "WANTED"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-800"
                  }`}
                >
                  구함
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                placeholder={
                  offerType === "RENT"
                    ? "예: 킹스크로스 근처 플랫메이트 구합니다"
                    : "예: 런던 존2 근처 방 구합니다"
                }
              />
            </div>

            <GooglePlacePickerWithMap onSelect={handleSelectPlace} />

            {address && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                선택된 위치: {address}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                거주 형태
              </label>
              <select
                value={stayType}
                onChange={(event) =>
                  setStayType(event.target.value as RentStayType)
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
              >
                <option value="LONG_TERM">장기</option>
                <option value="SHORT_TERM">단기</option>
                {offerType === "RENT" && (
                  <option value="FLEXIBLE">장단기</option>
                )}
              </select>
            </div>

            {offerType === "RENT" && (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      렌트 비용
                    </label>
                    <input
                      type="number"
                      value={rentFee}
                      onChange={(event) => setRentFee(event.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                      placeholder="예: 900"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      비용 구분
                    </label>
                    <select
                      value={rentFeeUnit}
                      onChange={(event) =>
                        setRentFeeUnit(event.target.value as RentFeeUnit)
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                    >
                      <option value="WEEK">주</option>
                      <option value="MONTH">월</option>
                      <option value="YEAR">년</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    Deposit
                  </label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(event) => setDeposit(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                    placeholder="예: 500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    입주일
                  </label>
                  <input
                    type="date"
                    value={availableFrom}
                    onChange={(event) => setAvailableFrom(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    Minimum stay
                  </label>
                  <input
                    type="text"
                    value={minimumStay}
                    onChange={(event) => setMinimumStay(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                    placeholder="예: 3 months"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    Notice period
                  </label>
                  <input
                    type="text"
                    value={noticePeriod}
                    onChange={(event) => setNoticePeriod(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                    placeholder="예: 2 weeks"
                  />
                </div>

                <ImageUploader imageUrls={imageUrls} onChange={setImageUrls} />
              </>
            )}

            {offerType === "WANTED" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    예산
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                    placeholder="예: 800"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    희망 입주일
                  </label>
                  <input
                    type="date"
                    value={preferredMoveInDate}
                    onChange={(event) =>
                      setPreferredMoveInDate(event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    희망 거주기간
                  </label>
                  <input
                    type="text"
                    value={preferredStayDuration}
                    onChange={(event) =>
                      setPreferredStayDuration(event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                    placeholder="예: 6 months"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                설명
              </label>
              <textarea
                rows={10}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                placeholder="집 상태, 주변 환경, 조건 등을 적어주세요"
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

export default RentWritePage;
