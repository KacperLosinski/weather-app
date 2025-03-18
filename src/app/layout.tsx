
import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="min-h-screen flex-col items-center justify-center transition-all content bg-cyan-100">
        {children}
      </body>
    </html>
  );
}
