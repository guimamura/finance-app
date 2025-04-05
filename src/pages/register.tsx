import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterData) => {
    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    ) as RegisterData[];

    const userExists = users.some((user) => user.email === data.email);

    if (userExists) {
      alert("E-mail já cadastrado.");
      return;
    }

    const newUsers = [...users, data];

    localStorage.setItem("users", JSON.stringify(newUsers));

    alert("Cadastro realizado com sucesso!");

    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Criar Conta</h1>

      <input placeholder="E-mail" {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input placeholder="Senha" type="password" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Cadastrar</button>

      <button type="button" onClick={() => router.push("/")}>
        Voltar para login
      </button>
    </form>
  );
}
