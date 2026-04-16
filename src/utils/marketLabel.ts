import type { MarketType } from "../types/post";

export function getMarketTypeLabel(marketType?: MarketType | null): string {
  switch (marketType) {
    case "SELL":
      return "판매";
    case "BUY":
      return "구함";
    default:
      return "";
  }
}
