import type { JobPostCreateRequest, JobPostDetail } from "../types/job";
import { authFetch } from "./fetchClient";

const BASE_URL = "/api/job-posts";

export async function createJobPost(
  request: JobPostCreateRequest,
): Promise<number> {
  const response = await authFetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("구직 글 생성에 실패했습니다.");
  }

  return response.json();
}

export async function getJobPostDetail(postId: number): Promise<JobPostDetail> {
  const response = await fetch(`${BASE_URL}/${postId}`);

  if (!response.ok) {
    throw new Error("구직 글 상세 조회에 실패했습니다.");
  }

  return response.json();
}

export async function updateJobPost(
  postId: number,
  request: JobPostCreateRequest,
): Promise<number> {
  const response = await authFetch(`${BASE_URL}/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("구직 글 수정에 실패했습니다.");
  }

  return response.json();
}
