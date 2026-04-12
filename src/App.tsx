import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";
import HomePage from "./pages/HomePage";
import DonghangPage from "./pages/DonghangPage";
import RentPage from "./pages/RentPage";
import JobPage from "./pages/JobPage";
import InfoPage from "./pages/InfoPage";
import DonghangWritePage from "./pages/DonghangWritePage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditPage from "./pages/PostEditPage";
import RentWritePage from "./pages/RentWritePage";
import RentDetailPage from "./pages/RentDetailPage";
import RentEditPage from "./pages/RentEditPage";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/donghang" element={<DonghangPage />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/job" element={<JobPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/donghang/write" element={<DonghangWritePage />} />
          <Route path="/rent/write" element={<RentWritePage />} />
          <Route path="/rent-posts/:postId" element={<RentDetailPage />} />
          <Route path="/rent-posts/:postId/edit" element={<RentEditPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/posts/:postId/edit" element={<PostEditPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
