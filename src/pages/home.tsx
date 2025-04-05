import { useRouter } from "next/router";
import { useEffect } from "react";
import { getStorageItem } from "@/lib/storage";
import { logout } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  const fetchQuotes = async () => {};

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    const user = getStorageItem("user");

    if (!user) {
      router.push("/");
      return;
    }

    fetchQuotes();
  }, [router]);

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">Finance App</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </header>

      <main className="p-4">
        <h2 className="text-lg">Bem-vindo à área logada!</h2>
      </main>
    </div>
  );
}
