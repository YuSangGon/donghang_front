import type {
  HomePostPreviewItem,
  PostCategory,
  PostDetail,
  PostPageResponse,
} from "../types/post";
import { authFetch } from "./fetchClient";

const BASE_URL = "/api/posts";

export interface CreatePostRequest {
  category: PostCategory;
  title: string;
  content: string;
  location: string;
  countryCode: string;
  countryName: string;
}

export interface UpdatePostRequest {
  title: string;
  content: string;
  location: string;
  category: PostCategory;
  countryCode: string;
  countryName: string;
}

export async function getPostsByCategory(
  category: PostCategory,
  page: number,
  size: number,
  countryCode?: string,
  keyword?: string,
): Promise<PostPageResponse> {
  const params = new URLSearchParams({
    category,
    page: String(page),
    size: String(size),
  });

  if (countryCode) params.set("countryCode", countryCode);
  if (keyword) params.set("keyword", keyword);

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("카테고리별 게시글 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getLatestPostsByCategory(
  category: PostCategory,
): Promise<HomePostPreviewItem[]> {
  const response = await fetch(
    `${BASE_URL}/latest?category=${encodeURIComponent(category)}`,
  );

  if (!response.ok) {
    throw new Error("최신 게시글을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getPostDetail(postId: number): Promise<PostDetail> {
  const response = await fetch(`${BASE_URL}/${postId}`);

  if (!response.ok) {
    throw new Error("게시글 상세 정보를 불러오지 못했습니다.");
  }

  return response.json();
}

export async function createPost(request: CreatePostRequest): Promise<number> {
  const response = await authFetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("게시글 생성에 실패했습니다.");
  }

  return response.json();
}

export async function updatePost(
  postId: number,
  request: UpdatePostRequest,
): Promise<number> {
  const response = await authFetch(`${BASE_URL}/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("게시글 수정에 실패했습니다.");
  }

  return response.json();
}

export async function deletePost(postId: number): Promise<void> {
  const response = await authFetch(`${BASE_URL}/${postId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("게시글 삭제에 실패했습니다.");
  }
}
