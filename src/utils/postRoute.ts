import type { PostCategory } from "../types/post";

export function getBoardPathByCategory(category: PostCategory): string {
  switch (category) {
    case "DONGHANG":
      return "/donghang";
    case "RENT":
      return "/rent";
    case "JOB":
      return "/job";
    case "INFO":
      return "/info";
    default:
      return "/";
  }
}

export function getWritePathByCategory(category: PostCategory): string {
  switch (category) {
    case "DONGHANG":
      return "/donghang/write";
    case "RENT":
      return "/rent/write";
    case "JOB":
      return "/job/write";
    case "INFO":
      return "/info/write";
    default:
      return "/";
  }
}

export function getDetailPathByCategory(
  category: PostCategory,
  postId: number,
): string {
  switch (category) {
    case "DONGHANG":
      return `/posts/${postId}`;
    case "RENT":
      return `/rent-posts/${postId}`;
    case "JOB":
      return `/job-posts/${postId}`;
    case "INFO":
      return `/info-posts/${postId}`;
    default:
      return `/posts/${postId}`;
  }
}
