import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getUser, saveSession, isSessionActive } from "@/utils/storage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isSessionActive()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = getUser();
    if (user && user.email === email && user.password === password) {
      saveSession();
      router.push("/dashboard");
    } else {
      alert("Usuário ou senha inválidos.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Senha"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Entrar
        </button>
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="text-sm underline"
        >
          Não tem conta? Cadastre-se
        </button>
      </form>
    </div>
  );
}
