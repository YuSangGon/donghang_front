function HeroSection() {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl rounded-[32px] bg-gradient-to-br from-slate-50 to-sky-50 px-8 py-14 md:px-14 md:py-20">
        <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm ring-1 ring-slate-200">
          해외 생활 커뮤니티 플랫폼
        </p>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
          여행 동행부터
          <br />
          렌트, 구직, 비자 정보까지
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          해외에서 필요한 사람, 정보, 기회를 한곳에서 찾을 수 있는 커뮤니티
          서비스
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            글 보러가기
          </button>
          <button className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            서비스 둘러보기
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
