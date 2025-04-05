import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  useAuth();

  return <div>Área logada</div>;
}
