import { useState } from "react";
import { useRouter } from "next/router";
import { saveUser } from "@/utils/storage";
import { User } from "@/types/User";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveUser(form);
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold">Cadastro</h1>
        <input
          name="name"
          placeholder="Nome"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Senha"
          type="password"
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
