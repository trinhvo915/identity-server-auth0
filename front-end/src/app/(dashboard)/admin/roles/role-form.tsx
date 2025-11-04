"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Role, CreateRoleRequest } from "@/core/models/role/role.types";
import { Loader2 } from "lucide-react";

interface RoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateRoleRequest) => Promise<void>;
  role?: Role | null;
  isLoading?: boolean;
}

export function RoleForm({
  open,
  onOpenChange,
  onSubmit,
  role,
  isLoading = false,
}: RoleFormProps) {
  const form = useForm<CreateRoleRequest>({
    defaultValues: {
      code: "",
      description: "",
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        code: role.code,
        description: role.description,
      });
    } else {
      form.reset({
        code: "",
        description: "",
      });
    }
  }, [role, form]);

  // Check if form has changes
  const hasChanges = role
    ? form.watch("description") !== role.description
    : form.watch("code") !== "" || form.watch("description") !== "";

  const handleSubmit = async (data: CreateRoleRequest) => {
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Create New Role"}</DialogTitle>
          <DialogDescription>
            {role
              ? "Update the role information below."
              : "Fill in the information to create a new role."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              rules={{
                required: "Role code is required",
                minLength: {
                  value: 2,
                  message: "Role code must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Role code must not exceed 50 characters",
                },
                pattern: {
                  value: /^[A-Z_]+$/,
                  message: "Role code must be uppercase letters and underscores only",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. ADMIN, USER, MODERATOR"
                      {...field}
                      disabled={isLoading || !!role}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    Unique role identifier (uppercase letters and underscores)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              rules={{
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
                maxLength: {
                  value: 500,
                  message: "Description must not exceed 500 characters",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the role's purpose and permissions..."
                      {...field}
                      disabled={isLoading}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !hasChanges}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {role ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
