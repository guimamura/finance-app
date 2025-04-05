import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { getStorageItem } from "@/lib/storage";

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
    const user = getStorageItem("user") as LoginData;

    if (!user) {
      alert("Usuário não encontrado. Cadastre-se primeiro.");
      return;
    }

    if (user.email !== data.email || user.password !== data.password) {
      alert("E-mail ou senha incorretos.");
      return;
    }

    // Salvar sessão no storage
    localStorage.setItem(
      "session",
      JSON.stringify({
        email: user.email,
        expiresAt: new Date().getTime() + 1000 * 60 * 30, // 30 minutos
      })
    );

    router.push("/dashboard"); // Redireciona para área logada
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
    </form>
  );
}
