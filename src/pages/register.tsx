import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { setStorageItem } from "@/lib/storage";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, "A senha deve ter no mínimo 4 caracteres"),
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
    setStorageItem("user", data);
    alert("Usuário cadastrado com sucesso!");
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Criar conta</h1>

      <input placeholder="E-mail" {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input placeholder="Senha" type="password" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Cadastrar</button>

      <button type="button" onClick={() => router.push("/")}>
        Voltar para o login
      </button>
    </form>
  );
}
