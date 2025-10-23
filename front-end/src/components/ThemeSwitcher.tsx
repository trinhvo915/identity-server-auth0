"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Palette, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useColorTheme } from "@/hooks/useColorTheme";
import { THEME_CONFIGS, ColorTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme, mounted } = useColorTheme();
  const [open, setOpen] = useState(false);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          Light / Dark Mode
        </DropdownMenuLabel>
        <div className="grid grid-cols-3 gap-2 p-2">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("light")}
            className="w-full"
          >
            <Sun className="h-4 w-4 mr-2" />
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("dark")}
            className="w-full"
          >
            <Moon className="h-4 w-4 mr-2" />
            Dark
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("system")}
            className="w-full"
          >
            System
          </Button>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Color Theme
        </DropdownMenuLabel>
        <div className="p-2 space-y-2">
          {Object.entries(THEME_CONFIGS).map(([key, config]) => {
            const isActive = colorTheme === key;
            return (
              <button
                key={key}
                onClick={() => setColorTheme(key as ColorTheme)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                  "hover:bg-accent/50 cursor-pointer",
                  isActive && "bg-accent"
                )}
              >
                {/* Color Preview Circle */}
                <div
                  className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center"
                  style={{ backgroundColor: config.preview }}
                >
                  {isActive && <Check className="w-5 h-5 text-white" />}
                </div>

                {/* Theme Info */}
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{config.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {config.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
