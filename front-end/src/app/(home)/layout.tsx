import { MusicNavbar } from "@/components/music/MusicNavbar";
import { MusicPlayer } from "@/components/music/MusicPlayer";
import { AuthTokenManager } from "@/components/AuthTokenManager";

export default function HomeLayout({ children}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col w-full">
            <AuthTokenManager />

            <MusicNavbar />

            <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/20 pb-24">
                <div className="w-full px-4 py-6">
                    {children}
                </div>
            </main>

            <MusicPlayer />
        </div>
    );
}