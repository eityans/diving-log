"use client";

import { DiveLog } from "@/types/diveLog";
import Link from "next/link";

interface DiveLogListProps {
  logs: DiveLog[];
}

export function DiveLogList({ logs }: DiveLogListProps) {
  if (logs.length === 0) {
    return <p className="text-gray-500">ログがありません</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {logs.map((log) => (
        <Link href={`/logs/${log.id}`} key={log.id} className="block">
          <div className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{log.spot_name}</h3>
              <span className="text-gray-500">
                {log.date} #{log.dive_number}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium text-gray-500">深度</div>
                <div>
                  {log.average_depth && `${log.average_depth}m`}
                  {log.max_depth && ` / ${log.max_depth}m`}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium text-gray-500">時刻</div>
                <div>
                  {log.entry_time && `${log.entry_time}`}
                  {log.exit_time && ` - ${log.exit_time}`}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium text-gray-500">水温</div>
                <div>
                  {log.min_temp && `${log.min_temp}°C`}
                  {log.max_temp && ` / ${log.max_temp}°C`}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium text-gray-500">ガイド</div>
                <div>{log.guide_name}</div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
