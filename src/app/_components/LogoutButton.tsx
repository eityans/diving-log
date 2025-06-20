"use client";

import { useSetAtom } from "jotai";
import { userInfoAtom } from "@/lib/jotai/userAtoms";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

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
    <Button
      onClick={handleLogout}
      variant="outlined"
      color="inherit"
      size="small"
      sx={{ mt: 2 }}
    >
      ログアウト
    </Button>
  );
}
