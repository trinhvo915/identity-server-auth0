"use client";

import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Shuffle, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState([30]);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");

  // Mock song data
  const currentSong = {
    title: "Summer Vibes",
    artist: "The Artists",
    album: "Best Hits 2024",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
    duration: "3:45",
    currentTime: "1:23",
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleLike = () => setIsLiked(!isLiked);
  const toggleShuffle = () => setIsShuffled(!isShuffled);
  const toggleRepeat = () => {
    setRepeatMode(repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Song Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:block relative w-14 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{currentSong.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex flex-shrink-0"
              onClick={toggleLike}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-primary text-primary")} />
            </Button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-2">
            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
                onClick={toggleShuffle}
              >
                <Shuffle className={cn("w-4 h-4", isShuffled && "text-primary")} />
              </Button>

              <Button variant="ghost" size="sm">
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                size="sm"
                className="w-10 h-10 rounded-full"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </Button>

              <Button variant="ghost" size="sm">
                <SkipForward className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
                onClick={toggleRepeat}
              >
                <Repeat className={cn("w-4 h-4", repeatMode !== "off" && "text-primary")} />
                {repeatMode === "one" && (
                  <span className="absolute text-[10px] font-bold">1</span>
                )}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="hidden md:flex items-center gap-2 w-full max-w-md">
              <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                {currentSong.currentTime}
              </span>
              <Slider
                value={progress}
                onValueChange={setProgress}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground min-w-[40px]">
                {currentSong.duration}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="hidden lg:flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
            >
              {isMuted || volume[0] === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={isMuted ? [0] : volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden mt-2">
          <Slider
            value={progress}
            onValueChange={setProgress}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
