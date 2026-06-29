import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FitNexus — Fitness & Gym Management Platform",
  description: "Discover fitness classes, book sessions, and track your fitness journey.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}