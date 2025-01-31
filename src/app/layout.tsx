import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aplikacja Pogodowa",
  description: "Sprawdzaj pogodę w dowolnym miejscu na świecie!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white min-h-screen flex flex-col items-center justify-center">
        {children}
      </body>
    </html>
  );
}
