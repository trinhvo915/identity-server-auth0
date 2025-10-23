"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { SongCard, type Song } from "@/components/music/SongCard";
import { Play, TrendingUp, Clock, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginSection } from "@/components/music/LoginSection";
import { LockedContent } from "@/components/music/LockedContent";

// Mock data
const trendingSongs: Song[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    duration: "3:20",
  },
  {
    id: "2",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    duration: "3:23",
  },
  {
    id: "3",
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
    duration: "3:35",
  },
  {
    id: "4",
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
    duration: "2:58",
  },
  {
    id: "5",
    title: "Peaches",
    artist: "Justin Bieber",
    album: "Justice",
    cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
    duration: "3:18",
  },
  {
    id: "6",
    title: "positions",
    artist: "Ariana Grande",
    album: "Positions",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
    duration: "2:52",
  },
];

const recentlyPlayed: Song[] = [
  {
    id: "7",
    title: "Drivers License",
    artist: "Olivia Rodrigo",
    cover: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=300&h=300&fit=crop",
    duration: "4:02",
  },
  {
    id: "8",
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    duration: "2:21",
  },
  {
    id: "9",
    title: "Heat Waves",
    artist: "Glass Animals",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    duration: "3:58",
  },
  {
    id: "10",
    title: "Montero",
    artist: "Lil Nas X",
    cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop",
    duration: "2:17",
  },
];

const Homepage = () => {
  const { data: session, status } = useSession();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const handlePlaySong = (song: Song) => {
    setSelectedSong(song);
    console.log("Playing:", song.title);
  };

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Login Section for Unauthenticated Users */}
      {!session ? (
        <LoginSection />
      ) : (
        /* Hero Section for Authenticated Users */
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-8 md:p-12 text-primary-foreground">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Welcome Back, {session.user?.name?.split(" ")[0] || "Music Lover"}!
            </h1>
            <p className="text-lg md:text-xl mb-6 text-primary-foreground/90 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Ready to discover amazing music? Your personalized experience awaits.
            </p>
            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Play className="w-5 h-5 mr-2" fill="currentColor" />
                Play Now
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Browse Library
              </Button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        </section>
      )}

      {/* Trending Now */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
          </div>
          <Button variant="ghost">See All</Button>
        </div>

        {!session ? (
          <LockedContent
            title="Unlock Trending Music"
            description="Sign in to see what's hot right now and discover the latest hits"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {trendingSongs.map((song) => (
                <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
              ))}
            </div>
          </LockedContent>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {trendingSongs.map((song) => (
              <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
            ))}
          </div>
        )}
      </section>

      {/* Recently Played */}
      {session && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold">Recently Played</h2>
            </div>
            <Button variant="ghost">See All</Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyPlayed.map((song) => (
              <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Playlists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListMusic className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">Popular Playlists</h2>
          </div>
          <Button variant="ghost">See All</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            {
              title: "Today's Top Hits",
              description: "Ed Sheeran is on top of the Hottest 50!",
              cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
              songs: "50 songs",
            },
            {
              title: "RapCaviar",
              description: "New music from Drake, Travis Scott and more",
              cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
              songs: "60 songs",
            },
            {
              title: "Chill Hits",
              description: "Kick back to the best new and recent chill hits",
              cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
              songs: "45 songs",
            },
            {
              title: "Rock Classics",
              description: "Rock legends & epic songs that continue to",
              cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
              songs: "75 songs",
            },
          ].map((playlist, index) => (
            <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="relative aspect-square rounded-md overflow-hidden mb-4 bg-muted">
                  <img
                    src={playlist.cover}
                    alt={playlist.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      size="icon"
                      className="w-14 h-14 rounded-full shadow-lg"
                    >
                      <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-bold mb-1 truncate">{playlist.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {playlist.description}
                </p>
                <p className="text-xs text-muted-foreground">{playlist.songs}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
