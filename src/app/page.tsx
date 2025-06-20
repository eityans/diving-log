"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { DiveLogList } from "./_components/DiveLogList";
import { useState, useEffect } from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { DiveLog } from "@/types/diveLog";

export default function Home() {
  const { user, isLoading } = useUser();
  const [logs, setLogs] = useState<DiveLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;

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
  }, [user]);

  if (isLoading || loadingLogs) return <div>Loading...</div>;

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">ようこそ</h1>
        <p>ログインするとダイビングログを管理できます</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">マイダイビングログ</h1>
      <DiveLogList logs={logs} currentUserId={user.sub} />
    </div>
  );
}
