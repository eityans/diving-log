"use client";

import { DiveLog } from "@/types/diveLog";
import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  ButtonBase,
} from "@mui/material";

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
                  {log.spot_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {log.date} #{log.dive_number}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.100" }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    深度
                  </Typography>
                  <Typography>
                    {log.average_depth && `${log.average_depth}m`}
                    {log.max_depth && ` / ${log.max_depth}m`}
                  </Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.100" }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    時刻
                  </Typography>
                  <Typography>
                    {log.entry_time && `${log.entry_time}`}
                    {log.exit_time && ` - ${log.exit_time}`}
                  </Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.100" }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    水温
                  </Typography>
                  <Typography>
                    {log.min_temp && `${log.min_temp}°C`}
                    {log.max_temp && ` / ${log.max_temp}°C`}
                  </Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.100" }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    ガイド
                  </Typography>
                  <Typography>{log.guide_name}</Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </ButtonBase>
      ))}
    </Box>
  );
}
