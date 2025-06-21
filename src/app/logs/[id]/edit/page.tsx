"use client";

import { DiveLogForm } from "@/app/_components/DiveLogForm";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DiveLog } from "@/types/diveLog";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { Button, Container, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function EditLogPage() {
  const { currentUser } = useCurrentUser();
  const { id } = useParams();
  const [log, setLog] = useState<DiveLog | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLog = async () => {
      if (!currentUser) return;

      try {
        const token = await getAccessToken();
        if (!token) throw new Error("認証トークンが取得できません");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dive_logs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setLog(data);
        }
      } catch (error) {
        console.error("Failed to fetch log:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [currentUser, id]);

  if (loading) return <div>Loading...</div>;
  if (!log) return <div>ログが見つかりません</div>;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <DiveLogForm initialData={log} isEdit={true} />
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ py: 2, mt: 2 }}
          onClick={() => router.push(`/logs/${id}`)}
        >
          戻る
        </Button>
      </Box>
    </Container>
  );
}
