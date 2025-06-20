"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";

export default function NewLogPage() {
  const { currentUser, isLoading } = useCurrentUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: "",
    spot_name: "",
    dive_number: "",
    user_id: currentUser?.id || "",
  });

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

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/dive_logs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("登録に失敗しました");
      }
      if (currentUser?.id) {
        router.push(`/users/${currentUser.id}`);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期せぬエラーが発生しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ダイビングログ登録
        </Typography>
        {currentUser?.id}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
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

          <TextField
            label="ダイビング本数"
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

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            fullWidth
            sx={{ py: 2, mt: 2 }}
          >
            {isSubmitting ? "送信中..." : "ログを登録"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
