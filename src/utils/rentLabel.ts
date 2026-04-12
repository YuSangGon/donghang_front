import type { RentOfferType } from "../types/post";

export function getRentOfferTypeLabel(
  offerType?: RentOfferType | null,
): string {
  switch (offerType) {
    case "RENT":
      return "렌트";
    case "WANTED":
      return "구함";
    default:
      return "";
  }
}

export function getRentOfferTypeBadgeClass(
  offerType?: RentOfferType | null,
): string {
  switch (offerType) {
    case "RENT":
      return "bg-sky-100 text-sky-700";
    case "WANTED":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
