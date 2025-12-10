"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <ul className="space-y-3">
        <li><Link href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">📊 Dashboard</Link></li>
        <li><Link href="#" className="block p-2 hover:bg-gray-700 rounded">🛒 Purchase</Link></li>
        <li><Link href="#" className="block p-2 hover:bg-gray-700 rounded">💰 Sales</Link></li>
        <li><Link href="#" className="block p-2 hover:bg-gray-700 rounded">🏢 Vendor</Link></li>
        <li><Link href="#" className="block p-2 hover:bg-gray-700 rounded">👤 Customer</Link></li>
      </ul>
    </div>
  );
}
