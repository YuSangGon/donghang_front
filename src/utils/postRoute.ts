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
