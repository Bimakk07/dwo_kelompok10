"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
    const path = usePathname();

    const menu = [
        { name: "Dashboard", url: "/" },
        { name: "OLAP Cube", url: "/cube" },
    ];

    return (
        <html lang="en">
            <body className="flex">
                
                {/* --- SIDEBAR --- */}
                <aside className="w-64 h-screen bg-gray-900 text-white p-5 space-y-4">
                    <h1 className="text-xl font-bold mb-6">📊 Warehouse Panel</h1>

                    {menu.map((item, i) => (
                        <Link 
                            key={i}
                            href={item.url}
                            className={`block p-3 rounded-md font-medium 
                            ${path === item.url ? "bg-gray-700" : "hover:bg-gray-800"}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </aside>

                {/* --- HALAMAN KONTEN --- */}
                <main className="flex-1 bg-gray-100 min-h-screen">{children}</main>
            </body>
        </html>
    );
}
