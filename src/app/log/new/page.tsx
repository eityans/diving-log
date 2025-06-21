"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { DiveLogForm } from "@/app/_components/DiveLogForm";
import { Button, Container, Box } from "@mui/material";

export default function NewLogPage() {
  const { currentUser, isLoading } = useCurrentUser();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (!currentUser) {
    router.push("/");
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <DiveLogForm />
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
    </Container>
  );
}
