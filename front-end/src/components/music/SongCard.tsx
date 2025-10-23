"use client";

import { Play, Heart, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover: string;
  duration: string;
}

interface SongCardProps {
  song: Song;
  onPlay?: (song: Song) => void;
  className?: string;
}

export function SongCard({ song, onPlay, className }: SongCardProps) {
  return (
    <Card className={cn("group relative overflow-hidden hover:shadow-lg transition-all duration-300", className)}>
      <CardContent className="p-4">
        {/* Album Cover */}
        <div className="relative aspect-square rounded-md overflow-hidden mb-4 bg-muted">
          <img
            src={song.cover}
            alt={song.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg"
              onClick={() => onPlay?.(song)}
            >
              <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
            </Button>
          </div>

          {/* Like Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Song Info */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold truncate text-sm">{song.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
            </div>

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
                <DropdownMenuItem>Add to Queue</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {song.album && (
            <p className="text-xs text-muted-foreground truncate">{song.album}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
