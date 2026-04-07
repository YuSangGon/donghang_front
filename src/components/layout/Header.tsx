function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-300 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <div className="text-2xl font-bold tracking-tight text-slate-950">
          동행
        </div>

        <nav className="hidden gap-8 text-sm font-semibold text-slate-700 md:flex">
          <a href="#companion" className="transition hover:text-slate-950">
            동행
          </a>
          <a href="#rent" className="transition hover:text-slate-950">
            렌트
          </a>
          <a href="#job" className="transition hover:text-slate-950">
            구직
          </a>
          <a href="#info" className="transition hover:text-slate-950">
            정보게시판
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
            로그인
          </button>
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
            회원가입
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
