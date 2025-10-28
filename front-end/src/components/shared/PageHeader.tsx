import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?: "default" | "outline" | "ghost" | "destructive";
  };
  children?: ReactNode;
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          size="lg"
          variant={action.variant || "default"}
          className="w-full sm:w-auto"
        >
          {action.icon}
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}
