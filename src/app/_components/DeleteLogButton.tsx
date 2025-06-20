"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export function DeleteLogButton({ logId }: { logId: string }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentUser } = useCurrentUser();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/dive_logs/${logId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );

      if (!response.ok) throw new Error("削除に失敗しました");
      window.location.reload();
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => setOpen(true)}
      >
        削除
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>ログを削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この操作は取り消せません。本当に削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>キャンセル</Button>
          <Button onClick={handleDelete} color="error" disabled={isDeleting}>
            {isDeleting ? "削除中..." : "削除"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
