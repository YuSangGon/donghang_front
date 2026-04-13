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
import JobWritePage from "./pages/JobWritePage";
import JobDetailPage from "./pages/JobDetailPage";
import JobEditPage from "./pages/JobEditPage";
import InfoWritePage from "./pages/InfoWritePage";
import InfoDetailPage from "./pages/InfoDetailPage";
import InfoEditPage from "./pages/InfoEditPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

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
          <Route path="/job/write" element={<JobWritePage />} />
          <Route path="/job-posts/:postId" element={<JobDetailPage />} />
          <Route path="/job-posts/:postId/edit" element={<JobEditPage />} />
          <Route path="/info/write" element={<InfoWritePage />} />
          <Route path="/info-posts/:postId" element={<InfoDetailPage />} />
          <Route path="/info-posts/:postId/edit" element={<InfoEditPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/posts/:postId/edit" element={<PostEditPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
