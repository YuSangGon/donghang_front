import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import CountrySelect from "../components/common/CountrySelect";
import { COUNTRY_OPTIONS } from "../constants/countries";
import { createMarketPost } from "../api/marketPostApi";
import type { MarketType } from "../types/market";
import { useToast } from "../contexts/ToastContext";

function MarketWritePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [marketType, setMarketType] = useState<MarketType>("SELL");
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!itemName.trim()) {
      setError(
        marketType === "SELL"
          ? "물건 이름을 입력해주세요."
          : "구하는 물건을 입력해주세요.",
      );
      return;
    }

    if (!countryCode) {
      setError("나라를 선택해주세요.");
      return;
    }

    if (!location.trim()) {
      setError("위치를 입력해주세요.");
      return;
    }

    if (price.trim() && Number(price) < 0) {
      setError("가격은 0 이상이어야 합니다.");
      return;
    }

    if (!content.trim()) {
      setError("설명을 입력해주세요.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const postId = await createMarketPost({
        title: title.trim(),
        content: content.trim(),
        marketType,
        itemName: itemName.trim(),
        price: price.trim() ? Number(price) : undefined,
        condition: marketType === "SELL" ? condition.trim() : undefined,
        contact: marketType === "SELL" ? contact.trim() : undefined,
        location: location.trim(),
        countryCode,
        countryName: selectedCountry?.name ?? "",
      });

      showToast("중고 글이 등록되었습니다.");
      navigate(`/market-posts/${postId}`);
    } catch (submitError) {
      console.error(submitError);
      setError("중고 글 등록 중 오류가 발생했습니다.");
      showToast("중고 글 등록 중 오류가 발생했습니다.", "error");
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
            중고 글쓰기
          </h1>
          <p className="mt-3 text-base text-slate-700">
            판매 또는 구함 글을 작성해보세요.
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
                  onClick={() => setMarketType("SELL")}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    marketType === "SELL"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-800"
                  }`}
                >
                  판매
                </button>

                <button
                  type="button"
                  onClick={() => setMarketType("BUY")}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    marketType === "BUY"
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
                  marketType === "SELL"
                    ? "예: 자전거 판매합니다"
                    : "예: 전자레인지 구합니다"
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                {marketType === "SELL" ? "물건 이름" : "구하는 물건"}
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(event) => setItemName(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                placeholder={
                  marketType === "SELL"
                    ? "예: 브롬톤 자전거"
                    : "예: 소형 전자레인지"
                }
              />
            </div>

            <CountrySelect value={countryCode} onChange={setCountryCode} />

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
                {marketType === "SELL" ? "판매 가격" : "희망 가격"}
              </label>
              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                placeholder="예: 50"
              />
            </div>

            {marketType === "SELL" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    상태
                  </label>
                  <input
                    type="text"
                    value={condition}
                    onChange={(event) => setCondition(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                    placeholder="예: 사용감 있음 / 거의 새상품"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    연락 방법
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
                    placeholder="예: 오픈채팅 / 카카오톡 / 댓글"
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
                placeholder="물건 상태, 거래 방식, 희망 조건 등을 적어주세요"
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

export default MarketWritePage;
