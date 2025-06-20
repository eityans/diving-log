"use client";

import { useSetAtom } from "jotai";
import { userInfoAtom } from "@/lib/jotai/userAtoms";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const setUserInfo = useSetAtom(userInfoAtom);
  const router = useRouter();

  const handleLogout = () => {
    // ユーザー情報をクリア
    setUserInfo(null);
    // ログアウト処理にリダイレクト
    router.push("/auth/logout");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-blue-500 hover:text-blue-700"
    >
      ログアウト
    </button>
  );
}
