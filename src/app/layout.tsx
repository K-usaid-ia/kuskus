"use client";
import "./globals.css";
// import type { Metadata } from 'next';
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/features/auth/AuthContext";
import "./globals.css";

// export const metadata: Metadata = {
//   title: "KUSAIDIA - Aid Distribution Platform",
//   description: "Transparent and efficient aid distribution through blockchain",
// };

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
