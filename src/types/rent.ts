export type RentOfferType = "RENT" | "WANTED";
export type RentStayType = "LONG_TERM" | "SHORT_TERM" | "FLEXIBLE";
export type RentFeeUnit = "WEEK" | "MONTH" | "YEAR";

export interface RentPostCreateRequest {
  title: string;
  content: string;

  offerType: RentOfferType;

  address: string;
  placeId: string;
  lat: number;
  lng: number;

  stayType: RentStayType;

  rentFee?: number;
  rentFeeUnit?: RentFeeUnit;
  deposit?: number;
  availableFrom?: string;
  minimumStay?: string;
  noticePeriod?: string;

  budget?: number;
  preferredMoveInDate?: string;
  preferredStayDuration?: string;

  imageUrls: string[];
}

export interface RentPostDetail {
  postId: number;
  userId: number;
  title: string;
  content: string;
  nickname: string;

  offerType: RentOfferType;

  address: string;
  placeId: string;
  lat: number;
  lng: number;

  stayType: RentStayType;

  rentFee?: number;
  rentFeeUnit?: RentFeeUnit;
  deposit?: number;
  availableFrom?: string;
  minimumStay?: string;
  noticePeriod?: string;

  budget?: number;
  preferredMoveInDate?: string;
  preferredStayDuration?: string;

  imageUrls: string[];
  createdAt: string;
}
