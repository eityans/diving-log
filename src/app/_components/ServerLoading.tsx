"use client";

import { User } from "@/types/user";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { LogoutButton } from "./LogoutButton";

interface ServerLoadingProps {
  loading: boolean;
  timeout?: number;
  debugInfo?: {
    currentState: string;
    currentUser?: User;
    isLoading?: boolean;
    loadingLogs?: boolean;
    error?: string | null;
  };
}

export function ServerLoading({
  loading,
  timeout = 3000,
  debugInfo,
}: ServerLoadingProps) {
  const [showServerStartMessage, setShowServerStartMessage] = useState(false);
  const [showLogoutSuggestion, setShowLogoutSuggestion] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer1 = setTimeout(() => {
        setShowServerStartMessage(true);
      }, timeout);

      const timer2 = setTimeout(() => {
        setShowLogoutSuggestion(true);
      }, timeout * 2); // ログアウト提案は2倍の時間後に表示

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setShowServerStartMessage(false);
      setShowLogoutSuggestion(false);
    }
  }, [loading, timeout]);

  if (!loading) return null;

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
      <Typography variant="h6">Loading...</Typography>

      {showServerStartMessage && (
        <>
          <Typography variant="body2" color="text.secondary">
            サーバーを起動中です。初回アクセスは少し時間がかかります...
          </Typography>
          {debugInfo && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "rgba(0,0,0,0.1)",
                borderRadius: 1,
                width: "100%",
                textAlign: "left",
              }}
            >
              <Typography variant="caption" component="div">
                <strong>Debug Info:</strong>
              </Typography>
              <Typography variant="caption" component="div">
                State: {debugInfo.currentState}
              </Typography>
              {debugInfo.currentUser !== undefined && (
                <Typography variant="caption" component="div">
                  User: {debugInfo.currentUser.toString()}
                </Typography>
              )}
              {debugInfo.isLoading !== undefined && (
                <Typography variant="caption" component="div">
                  isLoading: {debugInfo.isLoading.toString()}
                </Typography>
              )}
              {debugInfo.loadingLogs !== undefined && (
                <Typography variant="caption" component="div">
                  loadingLogs: {debugInfo.loadingLogs.toString()}
                </Typography>
              )}
              {debugInfo.error && (
                <Typography variant="caption" component="div">
                  error: {debugInfo.error}
                </Typography>
              )}
            </Box>
          )}
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
