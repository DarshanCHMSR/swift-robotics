import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const font = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Economics News Monitoring Agent",
  description: "AI-powered economic news tracking",
};

import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.variable} font-sans antialiased bg-slate-50`}
      >
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full min-h-screen bg-slate-50/50">
              <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur shadow-sm">
                <SidebarTrigger />
                <div className="flex flex-1 items-center justify-between">
                  <h1 className="text-xl font-bold tracking-tight text-primary">Workspace</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">MVP V1.0</span>
                  </div>
                </div>
              </header>
              <div className="p-8 max-w-7xl mx-auto">{children}</div>
            </main>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
