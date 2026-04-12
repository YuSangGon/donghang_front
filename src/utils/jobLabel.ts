import type { JobType } from "../types/post";

export function getJobTypeLabel(jobType?: JobType | null): string {
  switch (jobType) {
    case "PART_TIME":
      return "파트타임";
    case "FULL_TIME":
      return "풀타임";
    default:
      return "";
  }
}
