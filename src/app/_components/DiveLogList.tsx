"use client";

import { DiveLog } from "@/types/diveLog";
import Link from "next/link";
import { Card, CardContent, Typography, Box, ButtonBase } from "@mui/material";

interface DiveLogListProps {
  logs: DiveLog[];
}

export function DiveLogList({ logs }: DiveLogListProps) {
  if (logs.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" textAlign="center">
        ログがありません
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", my: 4 }}>
      {logs.map((log) => (
        <ButtonBase
          key={log.id}
          component={Link}
          href={`/logs/${log.id}`}
          sx={{ display: "block", textAlign: "left", mb: 2 }}
        >
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6" component="h3" fontWeight="bold">
                  {log.spot_name} {log.point_name && log.point_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {log.date} #{log.dive_number}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {log.average_depth && (
                  <Typography variant="body2" color="text.secondary">
                    深度: {log.average_depth}m
                    {log.max_depth && `/${log.max_depth}m`}
                  </Typography>
                )}
                {log.entry_time && (
                  <Typography variant="body2" color="text.secondary">
                    時刻: {log.entry_time}
                    {log.exit_time && `-${log.exit_time}`}
                  </Typography>
                )}
                {(log.min_temp || log.max_temp) && (
                  <Typography variant="body2" color="text.secondary">
                    水温: {log.min_temp && `${log.min_temp}°C`}
                    {log.max_temp && `/${log.max_temp}°C`}
                  </Typography>
                )}
                {log.guide_name && (
                  <Typography variant="body2" color="text.secondary">
                    ガイド: {log.guide_name}
                  </Typography>
                )}
                {log.air_remaining && (
                  <Typography variant="body2" color="text.secondary">
                    残圧: {log.air_remaining}bar
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </ButtonBase>
      ))}
    </Box>
  );
}
