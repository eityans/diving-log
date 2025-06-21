"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DiveLog } from "@/types/diveLog";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";

export interface DiveLogFormProps {
  initialData?: DiveLog;
  isEdit?: boolean;
}

export function DiveLogForm({ initialData, isEdit = false }: DiveLogFormProps) {
  const { currentUser, isLoading } = useCurrentUser();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<DiveLog>>(
    initialData || {
      spot_name: "",
      date: new Date().toISOString().split("T")[0],
      dive_number: 0,
      user_id: currentUser?.id || "",
      // 他のフィールドも追加
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
            throw new Error(errorData.exception || "保存に失敗しました"); // TODO:　適切なエラーメッセージ表示
          });
        }
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
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ダイビングログ
          {isEdit ? "編集" : "登録"}
        </Typography>
        {currentUser?.id}

        {error && (
          <Alert severity="error" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="ダイビングNo."
            name="dive_number"
            type="number"
            value={formData.dive_number}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ min: 1 }}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "background.paper",
                color: "text.primary",
              },
            }}
          />

          <TextField
            label="日付"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "background.paper",
                color: "text.primary",
              },
            }}
          />

          <TextField
            label="場所"
            name="spot_name"
            value={formData.spot_name}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "background.paper",
                color: "text.primary",
              },
            }}
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
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ py: 2, mt: 2 }}
            onClick={() => router.push("/")}
          >
            トップに戻る
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
