"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRoleBadge } from "./UserRoleBadge";
import { LogIn, LogOut } from "lucide-react";

export function SessionInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Signed In</CardTitle>
          <CardDescription>Please sign in to access protected content</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => signIn("auth0")} className="w-full">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In with Auth0
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Information</CardTitle>
        <CardDescription>You are currently signed in</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={session.user.image || undefined} />
            <AvatarFallback>
              {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name || "User"}
            </p>
            <p className="text-sm text-muted-foreground">
              {session.user.email || "No email"}
            </p>
          </div>
          <UserRoleBadge />
        </div>

        <div className="rounded-lg bg-muted p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">User ID:</div>
            <div className="font-mono text-xs">{session.user.id || "N/A"}</div>

            <div className="text-muted-foreground">Role:</div>
            <div className="font-semibold">{session.user.role || "GUEST"}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => signOut()} variant="outline" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}
