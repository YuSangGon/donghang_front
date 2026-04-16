import { authFetch } from "./fetchClient";
import type {
  MarketPostCreateRequest,
  MarketPostDetail,
} from "../types/market";

const BASE_URL = "/api/market-posts";

export async function createMarketPost(
  request: MarketPostCreateRequest,
): Promise<number> {
  const response = await authFetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("중고 글 생성에 실패했습니다.");
  }

  return response.json();
}

export async function getMarketPostDetail(
  postId: number,
): Promise<MarketPostDetail> {
  const response = await fetch(`${BASE_URL}/${postId}`);

  if (!response.ok) {
    throw new Error("중고 글 상세 조회에 실패했습니다.");
  }

  return response.json();
}

export async function updateMarketPost(
  postId: number,
  request: MarketPostCreateRequest,
): Promise<number> {
  const response = await authFetch(`${BASE_URL}/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("중고 글 수정에 실패했습니다.");
  }

  return response.json();
}
