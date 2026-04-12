export type PostCategory = "DONGHANG" | "RENT" | "JOB" | "INFO";
export type RentOfferType = "RENT" | "WANTED";

export interface PostListItem {
  id: number;
  title: string;
  location: string;
  nickname: string;
  viewCnt: number;
  category: PostCategory;
  createdAt: string;
  offerType?: RentOfferType | null;
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
