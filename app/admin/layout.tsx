import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/admin/inquiries"
            className="text-lg font-bold text-slate-900"
          >
            Support Desk Admin
          </Link>

          <nav className="flex items-center gap-6 text-sm text-slate-700">
            <Link href="/admin/inquiries" className="hover:text-slate-900">
              問い合わせ一覧
            </Link>

            <Link href="/contact" className="hover:text-slate-900">
              フォーム
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
