"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DiveLog } from "@/types/diveLog";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { Button } from "@mui/material";
import Link from "next/link";
import { DeleteLogButton } from "@/app/_components/DeleteLogButton";

export default function DiveLogDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const [log, setLog] = useState<DiveLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.token) return;

    const fetchLog = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dive_logs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch log");
        const data = await res.json();
        setLog(data);
      } catch (error) {
        console.error(error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [id, currentUser, router]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!log) return <div className="text-center py-8">ログが見つかりません</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{log.spot_name}</h1>
          <div className="text-gray-500">
            {log.date} #{log.dive_number}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-3">ダイビング情報</h2>
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">平均深度: </span>
                {log.average_depth ? `${log.average_depth}m` : "-"}
              </div>
              <div>
                <span className="text-gray-500">最大深度: </span>
                {log.max_depth ? `${log.max_depth}m` : "-"}
              </div>
              <div>
                <span className="text-gray-500">エントリー時刻: </span>
                {log.entry_time || "-"}
              </div>
              <div>
                <span className="text-gray-500">エキジット時刻: </span>
                {log.exit_time || "-"}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-3">環境情報</h2>
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">最高水温: </span>
                {log.max_temp ? `${log.max_temp}°C` : "-"}
              </div>
              <div>
                <span className="text-gray-500">最低水温: </span>
                {log.min_temp ? `${log.min_temp}°C` : "-"}
              </div>
              <div>
                <span className="text-gray-500">ガイド: </span>
                {log.guide_name || "-"}
              </div>
              <div>
                <span className="text-gray-500">ウェイト: </span>
                {log.weight ? `${log.weight}kg` : "-"}
              </div>
            </div>
          </div>
        </div>

        {log.memo && (
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h2 className="text-lg font-medium mb-3">メモ</h2>
            <p className="whitespace-pre-wrap">{log.memo}</p>
          </div>
        )}

        {log.user_id === currentUser?.id && (
          <div className="flex gap-4 justify-end">
            <Button
              component={Link}
              href={`/logs/${log.id}/edit`}
              variant="contained"
              color="primary"
            >
              編集
            </Button>
            <DeleteLogButton logId={log.id} />
          </div>
        )}
      </div>
    </div>
  );
}
