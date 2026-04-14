import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { signUp } from "../api/authApi";
import { useToast } from "../contexts/ToastContext";

function SignUpPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !loginId.trim() ||
      !password.trim() ||
      !email.trim() ||
      !nickname.trim()
    ) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await signUp({
        loginId: loginId.trim(),
        password,
        email: email.trim(),
        nickname: nickname.trim(),
        gender,
      });

      showToast("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (submitError) {
      console.error(submitError);
      setError("회원가입 중 오류가 발생했습니다.");
      showToast("회원가입에 실패했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold text-slate-950">회원가입</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="아이디"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            />
            <p className="mt-2 text-xs text-slate-500">
              8~50자, 영문 2자 이상/숫자/특수문자를 모두 포함해주세요.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            />

            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            />

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as "MALE" | "FEMALE")}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </select>

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
              {isSubmitting ? "가입 중..." : "회원가입"}
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}

export default SignUpPage;
