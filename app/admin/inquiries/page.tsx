"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "done";
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/inquiries`, {
          headers: {
            Accept: "application/json",
          },
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error("問い合わせ一覧の取得に失敗しました。");
        }

        setInquiries(json.data ?? []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "問い合わせ一覧の取得に失敗しました。",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [apiBaseUrl]);

  const getStatusLabel = (status: Inquiry["status"]) => {
    switch (status) {
      case "new":
        return "未対応";
      case "in_progress":
        return "対応中";
      case "done":
        return "完了";
      default:
        return status;
    }
  };

  const getStatusClassName = (status: Inquiry["status"]) => {
    switch (status) {
      case "new":
        return "bg-amber-100 text-amber-800";
      case "in_progress":
        return "bg-sky-100 text-sky-800";
      case "done":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">問い合わせ一覧</h1>
        <Link
          href="/contact"
          className="rounded-lg border border-slate-300 text-slate-500 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          問い合わせフォームへ
        </Link>
      </div>

      {loading ? <p className="text-slate-600">読み込み中...</p> : null}

      {error ? <p className="text-rose-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {inquiries.length === 0 ? (
            <div className="p-6 text-slate-600">
              問い合わせはまだありません。
            </div>
          ) : (
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    名前
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    メール
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    件名
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    ステータス
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    受信日時
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {inquiry.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {inquiry.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {inquiry.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="hover:underline"
                      >
                        {inquiry.subject}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClassName(
                          inquiry.status,
                        )}`}
                      >
                        {getStatusLabel(inquiry.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {new Date(inquiry.created_at).toLocaleString("ja-JP")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="inline-flex rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
                      >
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : null}
    </main>
  );
}
