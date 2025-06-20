"use client";

import { useState } from "react";
import { DiveLog } from "@/types/diveLog";
import { Button, TextField } from "@mui/material";
import { getAccessToken } from "@auth0/nextjs-auth0";

export interface DiveLogFormProps {
  initialData?: DiveLog;
  isEdit?: boolean;
}

export function DiveLogForm({ initialData, isEdit = false }: DiveLogFormProps) {
  const [formData, setFormData] = useState<Partial<DiveLog>>(
    initialData || {
      spot_name: "",
      date: "",
      dive_number: 0,
      // 他のフィールドも追加
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getAccessToken();
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/dive_logs/${initialData?.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/dive_logs`;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("保存に失敗しました");

      // 成功時の処理
    } catch (error) {
      console.error("保存エラー:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="スポット名"
        value={formData.spot_name}
        onChange={(e) =>
          setFormData({ ...formData, spot_name: e.target.value })
        }
        fullWidth
        required
      />
      {/* 他のフィールドも同様に追加 */}

      <div className="flex justify-end">
        <Button type="submit" variant="contained" color="primary">
          {isEdit ? "更新" : "作成"}
        </Button>
      </div>
    </form>
  );
}
