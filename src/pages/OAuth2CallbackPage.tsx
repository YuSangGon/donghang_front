import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { useToast } from "../contexts/ToastContext";
import { saveAuth } from "../utils/authStorage";

function OAuth2CallbackPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const userId = params.get("userId");
    const loginId = params.get("loginId");
    const nickname = params.get("nickname");

    if (!token || !userId || !loginId || !nickname) {
      showToast("Google 로그인 처리에 실패했습니다.", "error");
      navigate("/login");
      return;
    }

    saveAuth({
      accessToken: token,
      userId: Number(userId),
      loginId,
      nickname,
    });

    window.dispatchEvent(new Event("auth-changed"));
    showToast("Google 로그인되었습니다.");
    navigate("/");
  }, [navigate, showToast]);

  return (
    <MainLayout>
      <section className="mx-auto max-w-xl px-6 py-16 text-center">
        <div className="rounded-3xl border border-slate-300 bg-white px-6 py-10 shadow-sm">
          Google 로그인 처리 중입니다...
        </div>
      </section>
    </MainLayout>
  );
}

export default OAuth2CallbackPage;
