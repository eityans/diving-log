"use client";

import { DiveLog } from "@/types/diveLog";

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
            <button className="text-sm text-blue-500 mt-2">編集</button>
          )}
        </div>
      ))}
    </div>
  );
}
