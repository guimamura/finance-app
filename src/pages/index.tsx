import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginData) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(
      (user: LoginData) =>
        user.email === data.email && user.password === data.password
    );

    if (!user) {
      alert("Usuário não encontrado ou senha incorreta.");
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Login</h1>

      <input placeholder="E-mail" {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input placeholder="Senha" type="password" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Entrar</button>

      <button type="button" onClick={() => router.push("/register")}>
        Criar conta
      </button>

      <button
        type="button"
        onClick={() => {
          localStorage.clear();
          alert("localStorage limpo!");
        }}
        className="text-sm text-gray-500 underline mt-4"
      >
        Limpar localStorage
      </button>
    </form>
  );
}
