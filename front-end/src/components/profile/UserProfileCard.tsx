import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, Shield } from "lucide-react";

interface Role {
  id: string;
  code: string;
}

interface UserProfileCardProps {
  name: string;
  email: string;
  username: string;
  avatarUrl?: string;
  roles: Role[];
  isActivated: boolean;
  children?: ReactNode;
}

export function UserProfileCard({
  name,
  email,
  username,
  avatarUrl,
  roles,
  isActivated,
  children,
}: UserProfileCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 ring-4 ring-primary/10">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <CardTitle className="text-2xl mb-1">{name}</CardTitle>
              <CardDescription className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-base">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {email}
                </span>
                <span className="hidden sm:inline text-muted-foreground/50">•</span>
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  @{username}
                </span>
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {roles.map((role) => (
                <Badge
                  key={role.id}
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1"
                >
                  <Shield className="h-3 w-3" />
                  {role.code}
                </Badge>
              ))}
              {isActivated && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 px-3 py-1">
                  Active
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      {children && <CardContent className="pt-6">{children}</CardContent>}
    </Card>
  );
}
