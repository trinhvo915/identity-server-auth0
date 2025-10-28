import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface InfoSectionProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function InfoSection({ title, icon: Icon, children, className = "" }: InfoSectionProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        {title}
      </h3>
      {children}
    </div>
  );
}

interface InfoFieldProps {
  label: string;
  value: string | ReactNode;
  icon?: LucideIcon;
}

export function InfoField({ label, value, icon: Icon }: InfoFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-muted-foreground text-sm flex items-center gap-1.5">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </label>
      {typeof value === "string" ? (
        <p className="text-base font-medium">{value}</p>
      ) : (
        <div>{value}</div>
      )}
    </div>
  );
}

interface InfoGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}

export function InfoGrid({ children, columns = 2 }: InfoGridProps) {
  const gridCols = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {children}
    </div>
  );
}
