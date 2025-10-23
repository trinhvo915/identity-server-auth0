"use client";

import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Shield, User, UserCircle } from "lucide-react";

export function UserRoleBadge() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const role = session.user.role || "GUEST";

  const roleConfig = {
    ADMIN: {
      icon: Shield,
      variant: "default" as const,
      className: "bg-red-500 hover:bg-red-600 text-white",
    },
    USER: {
      icon: User,
      variant: "secondary" as const,
      className: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    GUEST: {
      icon: UserCircle,
      variant: "outline" as const,
      className: "",
    },
  };

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.GUEST;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {role}
    </Badge>
  );
}
