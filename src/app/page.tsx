"use client";

import { DiveLogList } from "@/app/_components/DiveLogList";
import { useState, useEffect } from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { DiveLog } from "@/types/diveLog";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { LogoutButton } from "@/app/_components/LogoutButton";
import Link from "next/link";
import { Button, Box, Typography } from "@mui/material";
import { ServerLoading } from "@/app/_components/ServerLoading";

export default function Home() {
  const { currentUser, isLoading } = useCurrentUser();
  const [logs, setLogs] = useState<DiveLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      if (isLoading) return;

      setLoadingLogs(true);
      try {
        const token = await getAccessToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me/logs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoadingLogs(false);
      }
    };

    fetchLogs();
  }, [currentUser]);

  console.log(isLoading);

  if (isLoading || loadingLogs) {
    return (
      <ServerLoading
        loading={true}
        debugInfo={{
          currentState: isLoading ? "User Loading" : "Logs Loading",
          currentUser: currentUser ?? undefined,
          isLoading: isLoading ?? undefined,
          loadingLogs,
          error: undefined,
        }}
      />
    );
  }

  if (!currentUser) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" fontWeight="bold" mb={2}>
          ようこそ
        </Typography>
        <Typography variant="body1" mb={4}>
          ログインするとダイビングログを管理できます
        </Typography>
        <Button
          component="a"
          href="/auth/login"
          variant="contained"
          color="primary"
          size="large"
        >
          ログイン/新規登録
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        fontWeight="bold"
        mb={4}
        textAlign="center"
      >
        マイダイビングログ
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        <Button
          component={Link}
          href="/log/new"
          variant="contained"
          color="primary"
          fullWidth
        >
          ログを登録
        </Button>
      </Box>

      <DiveLogList logs={logs} />

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <LogoutButton />
      </Box>
    </Box>
  );
}
