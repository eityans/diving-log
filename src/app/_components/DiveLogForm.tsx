"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DiveLog } from "@/types/diveLog";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import {
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  MenuItem,
} from "@mui/material";

export interface DiveLogFormProps {
  initialData?: DiveLog;
  isEdit?: boolean;
}

export function DiveLogForm({ initialData, isEdit = false }: DiveLogFormProps) {
  const { currentUser, isLoading, refreshUserInfo } = useCurrentUser();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<DiveLog>>(
    initialData || {
      spot_name: currentUser?.last_dive?.spot_name || "",
      date: new Date().toISOString().split("T")[0],
      dive_number: currentUser?.max_dive_number
        ? currentUser.max_dive_number + 1
        : 1,
      user_id: currentUser?.id || "",
      weight: currentUser?.last_dive?.weight || undefined,
      guide_name: currentUser?.last_dive?.guide_name || "",
      shop_name: currentUser?.last_dive?.shop_name || "",
      equipment: currentUser?.last_dive?.equipment || "",
      tank_capacity: currentUser?.last_dive?.tank_capacity || undefined,
      tank_material: currentUser?.last_dive?.tank_material || undefined,
    }
  );

  useEffect(() => {
    if (currentUser?.id) {
      setFormData((prev) => ({ ...prev, user_id: currentUser.id }));
    }
  }, [currentUser]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (!currentUser) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    const token = currentUser.token;

    const url = isEdit
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/dive_logs/${initialData?.id}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/dive_logs`;

    fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.exception || "保存に失敗しました");
          });
        }

        refreshUserInfo();
        router.push("/");
      })
      .catch((err) => {
        let errorMessage = "予期せぬエラーが発生しました";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }
        setError(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        ダイビングログ
        {isEdit ? "編集" : "登録"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="ダイビングNo."
            name="dive_number"
            type="number"
            value={formData.dive_number}
            onChange={handleChange}
            required
            variant="filled"
            inputProps={{ min: 1 }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="日付"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            variant="filled"
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 2 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="エントリー時刻"
            name="entry_time"
            type="time"
            value={formData.entry_time || ""}
            onChange={handleChange}
            variant="filled"
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="エキジット時刻"
            name="exit_time"
            type="time"
            value={formData.exit_time || ""}
            onChange={handleChange}
            variant="filled"
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="場所 (エリア名)"
            name="spot_name"
            value={formData.spot_name}
            onChange={handleChange}
            required
            fullWidth
            variant="filled"
            sx={{ mb: 2 }}
          />

          <TextField
            label="ポイント名"
            name="point_name"
            value={formData.point_name || ""}
            onChange={handleChange}
            fullWidth
            variant="filled"
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="ガイド名"
            name="guide_name"
            value={formData.guide_name || ""}
            onChange={handleChange}
            fullWidth
            variant="filled"
          />
          <TextField
            label="ショップ名"
            name="shop_name"
            value={formData.shop_name || ""}
            onChange={handleChange}
            fullWidth
            variant="filled"
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="平均深度 (m)"
            name="average_depth"
            type="number"
            value={formData.average_depth || ""}
            onChange={handleChange}
            variant="filled"
            inputProps={{ step: "0.1", min: 0 }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="最大深度 (m)"
            name="max_depth"
            type="number"
            value={formData.max_depth || ""}
            onChange={handleChange}
            variant="filled"
            inputProps={{ step: "0.1", min: 0 }}
            sx={{ flex: 1 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="最高水温 (°C)"
            name="max_temp"
            type="number"
            value={formData.max_temp || ""}
            onChange={handleChange}
            variant="filled"
            inputProps={{ step: "0.1" }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="最低水温 (°C)"
            name="min_temp"
            type="number"
            value={formData.min_temp || ""}
            onChange={handleChange}
            variant="filled"
            inputProps={{ step: "0.1" }}
            sx={{ flex: 1 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="ウェイト (kg)"
            name="weight"
            type="number"
            value={formData.weight || ""}
            onChange={handleChange}
            variant="filled"
            inputProps={{ step: "0.1", min: 0 }}
            sx={{ flex: 1 }}
          />

          <TextField
            select
            label="タンク種類"
            name="tank_material"
            value={formData.tank_material ?? ""}
            onChange={handleChange}
            variant="filled"
            sx={{ flex: 1 }}
          >
            <MenuItem value={"steel"}>スチール</MenuItem>
            <MenuItem value={"aluminum"}>アルミ</MenuItem>
          </TextField>
          <TextField
            label="タンク容量 (L)"
            name="tank_capacity"
            type="number"
            value={formData.tank_capacity || ""}
            onChange={handleChange}
            variant="filled"
            inputProps={{ min: 0 }}
            sx={{ flex: 1 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="透明度 (m)"
            name="visibility"
            type="number"
            value={formData.visibility || ""}
            onChange={handleChange}
            variant="filled"
            inputProps={{ step: "0.1", min: 0 }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="残圧 (bar)"
            name="air_remaining"
            type="number"
            value={formData.air_remaining || ""}
            onChange={handleChange}
            variant="filled"
            inputProps={{ step: "1", min: 0 }}
            sx={{ flex: 1 }}
          />
        </Box>

        <TextField
          label="機材"
          name="equipment"
          value={formData.equipment || ""}
          onChange={handleChange}
          fullWidth
          variant="filled"
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <TextField
          label="メモ"
          name="memo"
          value={formData.memo || ""}
          onChange={handleChange}
          fullWidth
          variant="filled"
          multiline
          rows={6}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          fullWidth
          sx={{ py: 2, mt: 2 }}
        >
          {isSubmitting ? "送信中..." : isEdit ? "ログを編集" : "ログを登録"}
        </Button>
      </Box>
    </div>
  );
}
