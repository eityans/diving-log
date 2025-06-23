"use client";

import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface ServerLoadingProps {
  loading: boolean;
  timeout?: number;
}

export function ServerLoading({ loading, timeout = 3000 }: ServerLoadingProps) {
  const [showServerStartMessage, setShowServerStartMessage] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowServerStartMessage(true);
      }, timeout);
      return () => clearTimeout(timer);
    } else {
      setShowServerStartMessage(false);
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
        <Typography variant="body2" color="text.secondary">
          サーバーを起動中です。初回アクセスは少し時間がかかります...
        </Typography>
      )}
    </Box>
  );
}
