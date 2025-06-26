"use client";

import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { LogoutButton } from "./LogoutButton";

type ConnectionStatus = "checking" | "connected" | "timeout";

export function ServerLoading({
  timeout = 3000,
  children,
}: {
  timeout?: number;
  children: React.ReactNode;
}) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("checking");
  const [showLogoutSuggestion, setShowLogoutSuggestion] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const checkConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/test`,
        {
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        setConnectionStatus("connected");
      }
    } catch {
      setConnectionStatus("timeout");
    }
  };

  useEffect(() => {
    // 初回チェック
    checkConnection();

    // 接続失敗時のみ定期的にチェック
    const intervalId = setInterval(() => {
      if (connectionStatus === "timeout") {
        checkConnection();
        setRetryCount((prev) => prev + 1);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [connectionStatus]);

  useEffect(() => {
    if (connectionStatus === "timeout" && retryCount >= 2) {
      const timer = setTimeout(() => {
        setShowLogoutSuggestion(true);
      }, timeout * 2);
      return () => clearTimeout(timer);
    }
  }, [connectionStatus, retryCount, timeout]);

  if (connectionStatus === "connected") return children;

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 4,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h6">
        {connectionStatus === "checking"
          ? "サーバー接続を確認中..."
          : "サーバー起動中..."}
      </Typography>

      {connectionStatus === "timeout" && (
        <>
          <Typography variant="body2" color="text.secondary">
            サーバーを起動中です。初回アクセスは少し時間がかかります...
          </Typography>
          <Button variant="outlined" onClick={checkConnection} sx={{ mt: 2 }}>
            再試行
          </Button>
        </>
      )}

      {showLogoutSuggestion && (
        <Box sx={{ mt: 3, p: 3, border: "1px dashed", borderRadius: 2 }}>
          <Typography variant="body1" gutterBottom>
            長時間ローディングが続いています
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ログアウトして再度ログインすると改善する場合があります
          </Typography>
          <LogoutButton />
        </Box>
      )}
    </Box>
  );
}
