import { MusicNavbar } from "@/components/music/MusicNavbar";
import { MusicPlayer } from "@/components/music/MusicPlayer";
import { AuthTokenManager } from "@/components/AuthTokenManager";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Auth Token Manager - Handles localStorage sync */}
      <AuthTokenManager />

      {/* Navbar */}
      <MusicNavbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-6 pb-32">
          {children}
        </div>
      </main>

      {/* Fixed Music Player at Bottom */}
      <MusicPlayer />
    </div>
  );
}
