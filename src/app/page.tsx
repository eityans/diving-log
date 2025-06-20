"use client";

import { DiveLogList } from "@/app/_components/DiveLogList";
import { useState, useEffect } from "react";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { DiveLog } from "@/types/diveLog";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { LogoutButton } from "@/app/_components/LogoutButton";
import Link from "next/link";

export default function Home() {
  const { currentUser, isLoading } = useCurrentUser();
  const [logs, setLogs] = useState<DiveLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!currentUser) return;

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

  if (isLoading || loadingLogs) return <div>Loading...</div>;

  if (!currentUser) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">ようこそ</h1>
        <p>ログインするとダイビングログを管理できます</p>
        <a href="/auth/login" rel="noopener noreferrer">
          ログイン/新規登録
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">マイダイビングログ</h1>
        <Link
          href="/log/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition-colors"
        >
          ログを登録
        </Link>
      </div>
      <DiveLogList logs={logs} currentUserId={currentUser.id} />
      <LogoutButton />
    </div>
  );
}
