import BoardPage from "./BoardPage";

function MarketPage() {
  return (
    <BoardPage
      category="MARKET"
      title="중고"
      description="중고 물품을 판매하거나 원하는 물건을 구해보세요."
      writePath="/market/write"
    />
  );
}

export default MarketPage;
