import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthTokenManager } from "@/components/AuthTokenManager";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  
  return (
      <SidebarProvider defaultOpen={defaultOpen}>
        <AuthTokenManager />
        <AppSidebar />
        <main className="flex-1 w-full min-w-0 overflow-x-hidden">
          <Navbar />
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </SidebarProvider>
  );
}
