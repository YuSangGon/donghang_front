export type PostCategory = "DONGHANG" | "RENT" | "JOB" | "INFO" | "MARKET";
export type RentOfferType = "RENT" | "WANTED";
export type JobType = "PART_TIME" | "FULL_TIME";
export type MarketType = "SELL" | "BUY";

export interface CountryOption {
  code: string;
  name: string;
  lat: number;
  lng: number;
}

export interface PostListItem {
  id: number;
  title: string;
  location: string;
  nickname: string;
  viewCnt: number;
  category: PostCategory;
  createdAt: string;
  countryCode: string;
  countryName: string;
  offerType?: RentOfferType | null;
  jobType?: JobType | null;
  marketType?: MarketType | null;
}

export interface HomePostPreviewItem {
  id: number;
  location: string;
  title: string;
  nickname: string;
  viewCnt: number;
}

export interface PostDetail {
  id: number;
  userId: number;
  nickname: string;
  category: PostCategory;
  title: string;
  content: string;
  location: string;
  countryCode: string;
  countryName: string;
  viewCnt: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostPageResponse {
  content: PostListItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}
