"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DiveLog, TankMaterial } from "@/types/diveLog";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { Button, Box, Typography, Paper } from "@mui/material";
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
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {log.spot_name} {log.point_name && log.point_name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {log.date} #{log.dive_number}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            mb: 4,
          }}
        >
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" mb={2}>
              ダイビング情報
            </Typography>
            <Box sx={{ display: "grid", gap: 1 }}>
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
              <div>
                <span className="text-gray-500">ガイド: </span>
                {log.guide_name || "-"}
              </div>
              <div>
                <span className="text-gray-500">ウェイト: </span>
                {log.weight ? `${log.weight}kg` : "-"}
              </div>
              <div>
                <span className="text-gray-500">残圧: </span>
                {log.air_remaining ? `${log.air_remaining}bar` : "-"}
              </div>
              <div>
                <span className="text-gray-500">タンク容量: </span>
                {log.tank_capacity ? `${log.tank_capacity}L` : "-"}
              </div>
              <div>
                <span className="text-gray-500">タンク種類: </span>
                {log.tank_material === TankMaterial.Steel
                  ? "スチール"
                  : log.tank_material === TankMaterial.Aluminum
                  ? "アルミ"
                  : "-"}
              </div>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" mb={2}>
              環境情報
            </Typography>
            <Box sx={{ display: "grid", gap: 1 }}>
              <div>
                <span className="text-gray-500">最高水温: </span>
                {log.max_temp ? `${log.max_temp}°C` : "-"}
              </div>
              <div>
                <span className="text-gray-500">最低水温: </span>
                {log.min_temp ? `${log.min_temp}°C` : "-"}
              </div>
              <div>
                <span className="text-gray-500">透明度: </span>
                {log.visibility ? `${log.visibility}m` : "-"}
              </div>
            </Box>
          </Paper>
        </Box>

        {log.equipment && (
          <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" component="h2" mb={2}>
              器材
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {log.equipment}
            </Typography>
          </Paper>
        )}

        {log.memo && (
          <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" component="h2" mb={2}>
              メモ
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {log.memo}
            </Typography>
          </Paper>
        )}

        {log.user_id === currentUser?.id && (
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mb: 4 }}
          >
            <Button
              component={Link}
              href={`/logs/${log.id}/edit`}
              variant="contained"
              color="primary"
            >
              編集
            </Button>
            <DeleteLogButton logId={log.id} />
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            component={Link}
            href="/"
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ maxWidth: 400 }}
          >
            トップへ戻る
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
