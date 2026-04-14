import type { RentPostCreateRequest, RentPostDetail } from "../types/rent";
import { authFetch } from "./fetchClient";

const BASE_URL = "/api/rent-posts";

export async function createRentPost(
  request: RentPostCreateRequest,
): Promise<number> {
  const response = await authFetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("렌트 글 생성에 실패했습니다.");
  }

  return response.json();
}

export async function getRentPostDetail(
  postId: number,
): Promise<RentPostDetail> {
  const response = await fetch(`${BASE_URL}/${postId}`);

  if (!response.ok) {
    throw new Error("렌트 글 상세 조회에 실패했습니다.");
  }

  return response.json();
}

export async function updateRentPost(
  postId: number,
  request: RentPostCreateRequest,
): Promise<number> {
  const response = await authFetch(`${BASE_URL}/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("렌트 글 수정에 실패했습니다.");
  }

  return response.json();
}
