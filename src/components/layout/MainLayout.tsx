import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ToastContainer from "../common/ToastContainer";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default MainLayout;
