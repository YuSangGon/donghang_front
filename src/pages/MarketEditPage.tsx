import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import CountrySelect from "../components/common/CountrySelect";
import { COUNTRY_OPTIONS } from "../constants/countries";
import { getMarketPostDetail, updateMarketPost } from "../api/marketPostApi";
import type { MarketPostDetail, MarketType } from "../types/market";
import { useToast } from "../contexts/ToastContext";

function MarketEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [marketType, setMarketType] = useState<MarketType>("SELL");
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [content, setContent] = useState("");

  const selectedCountry = useMemo(
    () => COUNTRY_OPTIONS.find((country) => country.code === countryCode),
    [countryCode],
  );

  useEffect(() => {
    async function fetchPost() {
      if (!postId) return;

      try {
        setLoading(true);
        const data: MarketPostDetail = await getMarketPostDetail(
          Number(postId),
        );
        setTitle(data.title);
        setMarketType(data.marketType);
        setItemName(data.itemName);
        setPrice(data.price != null ? String(data.price) : "");
        setCondition(data.condition ?? "");
        setContact(data.contact ?? "");
        setLocation(data.location);
        setCountryCode(data.countryCode);
        setContent(data.content);
      } catch (e) {
        console.error(e);
        setError("중고 글을 불러오지 못했습니다.");
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

    if (!content.trim()) {
      setError("설명을 입력해주세요.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await updateMarketPost(Number(postId), {
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

      showToast("중고 글이 수정되었습니다.");
      navigate(`/market-posts/${postId}`);
    } catch (e) {
      console.error(e);
      setError("중고 글 수정에 실패했습니다.");
      showToast("중고 글 수정에 실패했습니다.", "error");
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
              중고 글 수정
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/market-posts/${postId}`)}
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

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              placeholder="제목"
            />

            <input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              placeholder={marketType === "SELL" ? "물건 이름" : "구하는 물건"}
            />

            <CountrySelect value={countryCode} onChange={setCountryCode} />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              placeholder="위치"
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              placeholder={marketType === "SELL" ? "판매 가격" : "희망 가격"}
            />

            {marketType === "SELL" && (
              <>
                <input
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  placeholder="상태"
                />

                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  placeholder="연락 방법"
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

export default MarketEditPage;
