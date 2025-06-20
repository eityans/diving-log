"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { DiveLogForm } from "@/app/_components/DiveLogForm";

export default function NewLogPage() {
  const { currentUser, isLoading } = useCurrentUser();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (!currentUser) {
    router.push("/");
    return null;
  }

  return <DiveLogForm />;
}
