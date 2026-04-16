export type MarketType = "SELL" | "BUY";

export interface MarketPostCreateRequest {
  title: string;
  content: string;
  marketType: MarketType;
  itemName: string;
  price?: number;
  condition?: string;
  contact?: string;
  location: string;
  countryCode: string;
  countryName: string;
}

export interface MarketPostDetail {
  postId: number;
  userId: number;
  nickname: string;
  title: string;
  content: string;
  marketType: MarketType;
  itemName: string;
  price?: number;
  condition?: string;
  contact?: string;
  location: string;
  countryCode: string;
  countryName: string;
  createdAt: string;
}
