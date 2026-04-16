import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { login } from "../api/authApi";
import { useToast } from "../contexts/ToastContext";
import { saveAuth } from "../utils/authStorage";

function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loginId.trim()) {
      setError("아이디를 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const auth = await login({
        loginId: loginId.trim(),
        password,
      });

      saveAuth(auth);
      window.dispatchEvent(new Event("auth-changed"));
      showToast("로그인되었습니다.");
      navigate("/");
    } catch (submitError) {
      console.error(submitError);
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      showToast("로그인에 실패했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/oauth2/authorization/google";
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold text-slate-950">로그인</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                아이디
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(event) => setLoginId(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Google로 로그인
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}

export default LoginPage;
