import { useEffect } from "react";
import { useRouter } from "next/router";
import { getStorageItem, removeStorageItem } from "@/lib/storage";

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const session = getStorageItem<{ token: string; expiresAt: number }>(
      "session"
    );

    if (!session || session.expiresAt < Date.now()) {
      removeStorageItem("session");
      router.push("/");
    }
  }, [router]);
}
