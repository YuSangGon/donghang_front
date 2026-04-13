import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-300 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-slate-950"
        >
          동행
        </Link>

        <nav className="hidden gap-8 text-sm font-semibold text-slate-700 md:flex">
          <Link to="/donghang" className="transition hover:text-slate-950">
            동행
          </Link>
          <Link to="/rent" className="transition hover:text-slate-950">
            렌트
          </Link>
          <Link to="/job" className="transition hover:text-slate-950">
            구직
          </Link>
          <Link to="/info" className="transition hover:text-slate-950">
            정보게시판
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            회원가입
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
