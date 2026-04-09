import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";
import HomePage from "./pages/HomePage";
import DonghangPage from "./pages/DonghangPage";
import DonghangWritePage from "./pages/DonghangWritePage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditPage from "./pages/PostEditPage";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/donghang" element={<DonghangPage />} />
          <Route path="/donghang/write" element={<DonghangWritePage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/posts/:postId/edit" element={<PostEditPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
