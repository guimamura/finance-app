"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginData) => {
    setLoginError(null);
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(
      (user: LoginData) =>
        user.email === data.email && user.password === data.password
    );

    if (!user) {
      setLoginError("Usuário não encontrado ou senha incorreta.");
      return;
    }

    localStorage.setItem(
      "session",
      JSON.stringify({
        email: user.email,
        expiresAt: new Date().getTime() + 1000 * 60 * 30,
      })
    );

    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              placeholder="Seu e-mail"
              {...register("email")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              placeholder="Sua senha"
              {...register("password")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>

          {loginError && (
            <p className="text-red-500 text-sm italic text-center">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Entrar
          </button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-800"
            >
              Criar conta
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.clear();
                alert("localStorage limpo!");
              }}
              className="inline-block align-baseline font-semibold text-xs text-gray-500 hover:text-gray-800 underline"
            >
              Limpar localStorage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
