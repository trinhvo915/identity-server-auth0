"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Home, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default function AccessDeniedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 p-4 overflow-auto">
      <div className="w-full max-w-md mx-auto my-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <Card className="w-full shadow-2xl border-border/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-4">
            <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-2 ring-4 ring-destructive/20 animate-in zoom-in-50 duration-500">
              <ShieldAlert className="w-10 h-10 text-destructive animate-pulse" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight">
                Access Denied
              </CardTitle>
              <CardDescription className="text-base">
                You don&apos;t have permission to access this page
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-6">
            {/* Show if user is authenticated */}
            {isAuthenticated && session?.user && (
              <div className="bg-muted/50 rounded-xl p-4 space-y-3 border border-border/50 backdrop-blur-sm">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Signed in as
                  </p>
                  <p className="text-sm font-semibold truncate">
                    {session.user.email || session.user.name || "Guest"}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground font-medium">
                    Current Role
                  </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-background border border-border text-xs font-semibold shadow-sm">
                    {session.user.roles?.join(", ") || "USER"}
                  </span>
                </div>
              </div>
            )}

            {/* Show if user is NOT authenticated */}
            {!isAuthenticated && (
              <div className="bg-blue-500/10 dark:bg-blue-500/5 rounded-xl p-4 space-y-3 border border-blue-500/20">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  You don&apos;t have permission to access this page. Please sign in to continue.
                </p>
              </div>
            )}

            {isAuthenticated && (
              <div className="bg-amber-500/10 dark:bg-amber-500/5 rounded-xl p-4 border border-amber-500/20">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  This page requires{" "}
                  <span className="font-bold text-foreground bg-amber-500/20 px-2 py-0.5 rounded">
                    ADMIN
                  </span>{" "}
                  privileges. Please contact your system administrator if you believe you should have access.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 px-6 pb-6">
            {!isAuthenticated ? (
              <>
                <Link href="/" className="w-full sm:w-auto order-2 sm:order-1">
                  <Button variant="outline" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Home
                  </Button>
                </Link>
                <Button
                  className="w-full sm:flex-1 order-1 sm:order-2 shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => signIn("auth0")}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto order-2 sm:order-1"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                <Link href="/" className="w-full sm:flex-1 order-1 sm:order-2">
                  <Button className="w-full shadow-md hover:shadow-lg transition-shadow">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Home
                  </Button>
                </Link>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
