import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import PostForm from "../components/post/PostForm";
import { getPostDetail, updatePost } from "../api/postApi";
import type { PostDetail } from "../types/post";
import { useToast } from "../contexts/ToastContext";

function PostEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchPost() {
      if (!postId) {
        setError("잘못된 접근입니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getPostDetail(Number(postId));
        setPost(data);
      } catch (error) {
        console.error(error);
        setError("수정할 게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  const handleSubmit = async (values: {
    title: string;
    location: string;
    content: string;
  }) => {
    if (!postId) return;

    try {
      setIsSubmitting(true);

      await updatePost(Number(postId), {
        category: "DONGHANG",
        title: values.title,
        location: values.location,
        content: values.content,
      });

      showToast("게시글이 수정되었습니다.");
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error(error);
      setError("게시글 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="mx-auto max-w-4xl px-6 py-12">
        {loading && (
          <div className="rounded-3xl border border-slate-300 bg-white px-6 py-10 text-center text-slate-700 shadow-sm">
            게시글을 불러오는 중입니다...
          </div>
        )}

        {!loading && error && !post && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && post && (
          <>
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold text-sky-700">Edit</p>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950">
                동행 글 수정
              </h1>
              <p className="mt-3 text-base text-slate-700">
                게시글 내용을 수정해보세요.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <PostForm
              initialValues={{
                title: post.title,
                location: post.location,
                content: post.content,
              }}
              submitLabel="수정하기"
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </>
        )}
      </section>
    </MainLayout>
  );
}

export default PostEditPage;
