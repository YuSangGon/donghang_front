import BoardPage from "./BoardPage";

function RentPage() {
  return (
    <BoardPage
      category="RENT"
      title="렌트"
      description="지역별 집, 쉐어룸, 단기 렌트 정보를 확인해보세요."
      writePath="/rent/write"
    />
  );
}

export default RentPage;
