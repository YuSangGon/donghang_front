import BoardPage from "./BoardPage";

function JobPage() {
  return (
    <BoardPage
      category="JOB"
      title="구직"
      description="현지 아르바이트, 풀타임, 단기 일자리 정보를 찾아보세요."
      writePath="/job/write"
    />
  );
}

export default JobPage;
