"use client";

import { signIn } from "next-auth/react";
import { Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LockedContentProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function LockedContent({ title, description, children }: LockedContentProps) {
  const handleLogin = async () => {
    await signIn("auth0");
  };

  return (
    <div className="relative">
      {/* Blurred Content */}
      <div className="pointer-events-none select-none blur-sm opacity-40">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg">
        <div className="text-center max-w-md p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          {description && (
            <p className="text-muted-foreground mb-6">{description}</p>
          )}
          <Button onClick={handleLogin} size="lg" className="shadow-lg">
            <LogIn className="w-5 h-5 mr-2" />
            Sign In to Unlock
          </Button>
        </div>
      </div>
    </div>
  );
}
