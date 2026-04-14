export type JobType = "PART_TIME" | "FULL_TIME";

export interface JobPostCreateRequest {
  title: string;
  content: string;
  location: string;
  jobType: JobType;
  pay: number;
  position: string;
}

export interface JobPostDetail {
  userId: number;
  postId: number;
  title: string;
  content: string;
  nickname: string;
  location: string;
  jobType: JobType;
  pay: number;
  position: string;
  createdAt: string;
}
