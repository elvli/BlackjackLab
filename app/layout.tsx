import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./store/StoreProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "BlackJack Lab",
  description:
    "Master your Blackjack skills with interactive training, tutorials, and real-time feedback. Improve your strategy and boost your confidence at the table.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en" className={montserrat.variable}>
        <body className="antialiased">{children}</body>
      </html>
    </StoreProvider>
  );
}
