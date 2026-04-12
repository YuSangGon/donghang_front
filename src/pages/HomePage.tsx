import { useEffect, useState } from "react";
import HeroSection from "../components/home/HeroSection";
import PreviewSection from "../components/home/PreviewSection";
import MainLayout from "../components/layout/MainLayout";
import { getLatestPostsByCategory } from "../api/postApi";
import type { HomePostPreviewItem } from "../types/post";

interface HomePostsState {
  companionPosts: HomePostPreviewItem[];
  rentPosts: HomePostPreviewItem[];
  jobPosts: HomePostPreviewItem[];
  infoPosts: HomePostPreviewItem[];
}

function HomePage() {
  const [posts, setPosts] = useState<HomePostsState>({
    companionPosts: [],
    rentPosts: [],
    jobPosts: [],
    infoPosts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHomePosts() {
      try {
        setLoading(true);
        setError("");

        const [companionPosts, rentPosts, jobPosts, infoPosts] =
          await Promise.all([
            getLatestPostsByCategory("DONGHANG"),
            getLatestPostsByCategory("RENT"),
            getLatestPostsByCategory("JOB"),
            getLatestPostsByCategory("INFO"),
          ]);

        setPosts({
          companionPosts,
          rentPosts,
          jobPosts,
          infoPosts,
        });
      } catch (err) {
        console.error(err);
        setError("홈 게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchHomePosts();
  }, []);

  return (
    <MainLayout>
      <HeroSection />

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          {loading && (
            <div className="rounded-3xl border border-slate-300 bg-white px-6 py-10 text-center text-slate-700 shadow-sm">
              홈 게시글을 불러오는 중입니다...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700 shadow-sm">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PreviewSection
                id="companion"
                title="동행"
                description="해외에서 함께 여행하거나 일정 맞는 사람을 찾아보세요."
                posts={posts.companionPosts}
                moreLink="/donghang"
              />

              <PreviewSection
                id="rent"
                title="렌트"
                description="지역별 집, 쉐어룸, 단기 렌트 정보를 확인해보세요."
                posts={posts.rentPosts}
                moreLink="/rent"
              />

              <PreviewSection
                id="job"
                title="구직"
                description="현지 아르바이트, 풀타임, 단기 일자리 정보를 찾아보세요."
                posts={posts.jobPosts}
                moreLink="/job"
              />

              <PreviewSection
                id="info"
                title="정보게시판"
                description="워홀, 비자, 정착, 생활 정보를 공유해보세요."
                posts={posts.infoPosts}
                moreLink="/info"
              />
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default HomePage;
