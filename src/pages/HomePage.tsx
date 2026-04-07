import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import PreviewSection from "../components/home/PreviewSection";
import {
  companionPosts,
  rentPosts,
  jobPosts,
  infoPosts,
} from "../data/mockHomeData";

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main>
        <HeroSection />

        <section className="px-6 pb-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
            <PreviewSection
              id="companion"
              title="동행"
              description="해외에서 함께 여행하거나 일정 맞는 사람을 찾아보세요."
              posts={companionPosts}
            />

            <PreviewSection
              id="rent"
              title="렌트"
              description="지역별 집, 쉐어룸, 단기 렌트 정보를 확인해보세요."
              posts={rentPosts}
            />

            <PreviewSection
              id="job"
              title="구직"
              description="현지 아르바이트, 풀타임, 단기 일자리 정보를 찾아보세요."
              posts={jobPosts}
            />

            <PreviewSection
              id="info"
              title="정보게시판"
              description="워홀, 비자, 정착, 생활 정보를 공유해보세요."
              posts={infoPosts}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
