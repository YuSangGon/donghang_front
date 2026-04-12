import BoardPage from "./BoardPage";

function InfoPage() {
  return (
    <BoardPage
      category="INFO"
      title="정보게시판"
      description="워홀, 비자, 정착, 생활 정보를 공유해보세요."
      writePath="/info/write"
    />
  );
}

export default InfoPage;
