import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "../components/theme-provider";

import { Montserrat } from "next/font/google";
import "./globals.css";

import { StoreProvider } from "./store/StoreProvider";

import Navbar from "@/components/Navbar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BlackjackLab",
  description: "Practice and master Blackjack with our interactive lab.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <ClerkProvider>
        <html
          lang="en"
          className={montserrat.className}
          suppressHydrationWarning
          style={{ height: "100%" }}
        >
          <body className="antialiased h-screen overflow-hidden">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider>
                <div className="flex flex-col h-screen w-screen">
                  <Navbar />

                  <div className="flex flex-1 overflow-hidden">
                    <AppSidebar />

                    <SidebarInset className="flex-1 overflow-auto">
                      {children}
                    </SidebarInset>
                  </div>
                </div>
              </SidebarProvider>
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
    </StoreProvider>
  );
}
