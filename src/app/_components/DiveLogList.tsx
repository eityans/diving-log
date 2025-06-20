"use client";

import { DiveLog } from "@/types/diveLog";
import { DeleteLogButton } from "./DeleteLogButton";
import { Button } from "@mui/material";
import Link from "next/link";

interface DiveLogListProps {
  logs: DiveLog[];
  currentUserId: string;
}

export function DiveLogList({ logs, currentUserId }: DiveLogListProps) {
  if (logs.length === 0) {
    return <p className="text-gray-500">ログがありません</p>;
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="border p-4 rounded-lg">
          <div className="flex justify-between">
            <h3 className="font-medium">{log.spot_name}</h3>
            <span className="text-sm text-gray-500">{log.date}</span>
          </div>
          <p className="text-sm">ダイビング本数: {log.dive_number}</p>
          {log.user_id === currentUserId && (
            <div className="flex gap-2 mt-2">
              <Button
                component={Link}
                href={`/logs/${log.id}/edit`}
                size="small"
                color="primary"
                variant="outlined"
              >
                編集
              </Button>
              <DeleteLogButton logId={log.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
