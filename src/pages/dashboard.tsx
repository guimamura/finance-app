import { useEffect } from "react";
import { useRouter } from "next/router";
import { isSessionActive, clearSession } from "@/utils/storage";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isSessionActive()) {
      clearSession();
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col gap-4">
      <h1 className="text-2xl font-bold">Área Logada</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded"
      >
        Sair
      </button>
    </div>
  );
}
