import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import PostForm from "../components/post/PostForm";
import { createPost } from "../api/postApi";
import { useToast } from "../contexts/ToastContext";

function DonghangWritePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { showToast } = useToast();

  const handleSubmit = async (values: {
    title: string;
    location: string;
    content: string;
  }) => {
    try {
      setIsSubmitting(true);
      setSubmitError("");

      const postId = await createPost({
        userId: 1,
        category: "DONGHANG",
        title: values.title,
        location: values.location,
        content: values.content,
      });

      showToast("게시글이 등록되었습니다.");
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error(error);
      setSubmitError("글 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-sky-700">Write</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            동행 글쓰기
          </h1>
          <p className="mt-3 text-base text-slate-700">
            함께할 사람을 찾을 수 있도록 내용을 작성해보세요.
          </p>
        </div>

        {submitError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <PostForm
          submitLabel="등록하기"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </section>
    </MainLayout>
  );
}

export default DonghangWritePage;
