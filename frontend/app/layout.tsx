// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Dashboard",
  description: "Dashboard dengan Sidebar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen">

          {/* --- SIDEBAR --- */}
          <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 gap-4">

            {/* Header */}
            <h1 className="text-2xl font-bold mb-4">📊 Warehouse Panel</h1>

            {/* Menu */}
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer border border-gray-600 shadow-sm transition-colors">
                <span>🏠</span>
                <Link href="/">Dashboard</Link>
              </li>

              <li className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer border border-gray-600 shadow-sm transition-colors">
                <span>🧊</span>
                <Link href="/cube">Cube OLAP</Link>
              </li>
            </ul>

            {/* Footer: tulisan di bawah */}
            <div className="mt-auto text-center text-white text-lg font-bold">
              Kelompok 10 DWO
            </div>
          </aside>

          {/* --- KONTEN UTAMA --- */}
          <main className="flex-1 bg-gray-100 p-6 overflow-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
