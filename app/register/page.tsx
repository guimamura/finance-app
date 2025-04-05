"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterData) => {
    setRegistrationError(null);
    setRegistrationSuccess(false);
    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    ) as RegisterData[];

    const userExists = users.some((user) => user.email === data.email);

    if (userExists) {
      setRegistrationError("Este e-mail já está cadastrado.");
      return;
    }

    const newUsers = [...users, data];

    localStorage.setItem("users", JSON.stringify(newUsers));
    setRegistrationSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Criar Conta
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
              placeholder="Sua senha (mínimo 6 caracteres)"
              {...register("password")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>

          {registrationError && (
            <p className="text-red-500 text-sm italic text-center">
              {registrationError}
            </p>
          )}

          {registrationSuccess && (
            <p className="text-green-500 text-sm italic text-center">
              Cadastro realizado com sucesso! Redirecionando...
            </p>
          )}

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Cadastrar
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-800"
            >
              Voltar para login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
