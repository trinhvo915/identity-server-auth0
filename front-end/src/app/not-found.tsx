"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileQuestion, Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 p-4 overflow-auto">
      <div className="w-full max-w-lg mx-auto my-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <Card className="w-full shadow-2xl border-border/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-4">
            {/* Icon with 404 overlay */}
            <div className="relative">
              <h1 className="text-9xl font-black text-muted-foreground/20 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center ring-4 ring-primary/20 animate-in zoom-in-50 duration-500">
                  <FileQuestion className="w-12 h-12 text-primary animate-pulse" />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <CardTitle className="text-3xl font-bold tracking-tight">
                Page Not Found
              </CardTitle>
              <CardDescription className="text-base">
                The page you&apos;re looking for doesn&apos;t exist or has been moved
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-6">
            {/* Helpful suggestions */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-3 border border-border/50 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Search className="w-4 h-4" />
                What you can do:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Check the URL for typos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Go back to the previous page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Visit our homepage to start fresh</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Contact support if the problem persists</span>
                </li>
              </ul>
            </div>

          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 px-6 pb-6">
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
          </CardFooter>
        </Card>

        {/* Error code hint */}
        <p className="text-center text-xs text-muted-foreground mt-4 opacity-50">
          Error Code: 404 • Page Not Found
        </p>
      </div>
    </div>
  );
}
