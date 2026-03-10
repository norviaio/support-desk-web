"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "done";
  admin_note: string | null;
  created_at: string;
};

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [status, setStatus] = useState<Inquiry["status"]>("new");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    const fetchInquiry = async () => {
      const res = await fetch(`${apiBaseUrl}/api/inquiries/${id}`, {
        headers: {
          Accept: "application/json",
        },
      });

      const json = await res.json();

      setInquiry(json.data);
      setStatus(json.data.status);
      setAdminNote(json.data.admin_note ?? "");
    };

    fetchInquiry();
  }, [apiBaseUrl, id]);

  const updateInquiry = async () => {
    const res = await fetch(`${apiBaseUrl}/api/inquiries/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        status,
        admin_note: adminNote,
      }),
    });

    const json = await res.json();

    if (res.ok) {
      router.push("/admin/inquiries");
    } else {
      alert(json.message ?? "更新失敗");
    }
  };

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

  if (!inquiry) {
    return <p className="p-10">読み込み中...</p>;
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-10">
      <Link
        href="/admin/inquiries"
        className="inline-block text-sm text-slate-500 hover:text-slate-700"
      >
        ← 一覧へ戻る
      </Link>

      <h1 className="text-2xl font-bold">問い合わせ詳細</h1>

      <div className="space-y-2 text-slate-700">
        <p>
          <b>名前：</b> {inquiry.name}
        </p>

        <p>
          <b>Email：</b> {inquiry.email}
        </p>

        <p>
          <b>件名：</b> {inquiry.subject}
        </p>

        <p>
          <b>メッセージ：</b>
        </p>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-500">
          {inquiry.message}
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <label className="block font-semibold text-slate-700">
            現在のステータス
          </label>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusClassName(
              inquiry.status,
            )}`}
          >
            {getStatusLabel(inquiry.status)}
          </span>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-slate-700">
            ステータス変更
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Inquiry["status"])}
            className="rounded-lg border p-2 bg-white border-slate-200 text-slate-900"
          >
            <option value="new">未対応</option>
            <option value="in_progress">対応中</option>
            <option value="done">完了</option>
          </select>
        </div>

        <label className="block font-semibold text-slate-700">管理メモ</label>

        <textarea
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          className="w-full rounded-lg border p-3 bg-white border-slate-200 text-slate-900"
          rows={4}
        />

        <button
          onClick={updateInquiry}
          className="rounded-lg bg-slate-900 px-5 py-2 text-white"
        >
          更新
        </button>
      </div>
    </main>
  );
}
