function Footer() {
  return (
    <footer className="border-t border-slate-300 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-950">동행</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              해외 생활에 필요한 연결과 정보를 제공하는 커뮤니티 서비스
            </p>
          </div>

          <div className="flex gap-6 text-sm font-medium text-slate-700">
            <a href="/">이용약관</a>
            <a href="/">개인정보처리방침</a>
            <a href="/">문의하기</a>
          </div>
        </div>

        <div className="mt-8 text-sm text-slate-600">
          © 2026 Donghang. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
