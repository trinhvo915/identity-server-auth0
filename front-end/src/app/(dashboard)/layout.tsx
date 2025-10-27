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
        <main className="w-full">
          <Navbar />
          <div className="px-4">{children}</div>
        </main>
      </SidebarProvider>
  );
}
