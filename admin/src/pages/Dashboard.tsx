import { useAuth } from "@/contexts/auth/useAuth";
import React from "react";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="text-white">
      {user?.id}
      {user?.name}
    </div>
  );
};

export default Dashboard;
