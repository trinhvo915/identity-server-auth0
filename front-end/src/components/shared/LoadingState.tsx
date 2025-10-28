import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className = "" }: LoadingStateProps) {
  return (
    <div className={`flex h-full w-full items-center justify-center min-h-[60vh] ${className}`}>
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        {message && <p className="text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}

export function InlineLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
}
