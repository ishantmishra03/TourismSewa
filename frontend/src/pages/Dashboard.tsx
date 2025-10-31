import { useAuth } from "../contexts/auth/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      {user?.name}
      {user?.id}
    </div>
  );
}
