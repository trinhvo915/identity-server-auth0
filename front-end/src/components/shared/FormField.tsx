import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps {
  label: string;
  id: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  disabled?: boolean;
  className?: string;
}

export function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required,
  hint,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  disabled,
  className = "",
}: FormFieldProps) {
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-base font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${error ? "border-red-500 focus-visible:ring-red-500" : ""} ${
            showPasswordToggle ? "pr-10" : ""
          } h-11`}
          placeholder={placeholder}
          disabled={disabled}
        />
        {showPasswordToggle && onTogglePassword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">{error}</p>
      )}
      {!error && hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

interface FormActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  submitIcon?: ReactNode;
  cancelIcon?: ReactNode;
}

export function FormActions({
  onCancel,
  onSubmit,
  submitLabel = "Save Changes",
  cancelLabel = "Cancel",
  isSubmitting,
  submitIcon,
  cancelIcon,
}: FormActionsProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        size="lg"
        className="w-full sm:w-auto"
      >
        {cancelIcon}
        {cancelLabel}
      </Button>
      <Button
        type={onSubmit ? "button" : "submit"}
        onClick={onSubmit}
        disabled={isSubmitting}
        size="lg"
        className="w-full sm:w-auto"
      >
        {submitIcon}
        {submitLabel}
      </Button>
    </div>
  );
}
