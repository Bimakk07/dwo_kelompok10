"use client";

import { useState } from "react";
import Link from "next/link";

export default function CubePage() {
  const [tab, setTab] = useState<"sales" | "purchase" | null>(null);

  const urlMap: Record<"sales" | "purchase", string> = {
    sales: "http://localhost:8080/mondrian/testpage.jsp?query=sales",
    purchase: "http://localhost:8080/mondrian/testpage.jsp?query=purchase",
  };

  return (
    <div className="flex h-screen">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 gap-4">
        <h1 className="text-2xl font-bold mb-4">📊 Warehouse Panel</h1>

        <Link href="/" className="p-3 rounded hover:bg-gray-700 border border-gray-600">
          🏠 Dashboard
        </Link>

        <Link href="/cube" className="p-3 rounded hover:bg-gray-700 border border-gray-600">
          🧊 Cube OLAP
        </Link>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "/auth"; // redirect logout
          }}
          className="mt-auto flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 21V3h12l6 6v12H3zM15 3v6h6M15 12l6 6"
            />
          </svg>
          Logout
        </button>

        <div className="mt-4 text-center font-bold">
          Kelompok 10 DWO
        </div>
      </aside>

      {/* ===== CONTENT ===== */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <h2 className="text-2xl font-bold text-black mb-4">Cube OLAP</h2>
        <p className="mb-4 text-black">
          Analisis Penjualan & Pembelian Data Warehouse AdventureWorks.
        </p>

        {/* Tombol Analisis */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setTab("sales")}
            className={`px-4 py-2 font-semibold rounded transition-colors
              ${tab === "sales" ? "bg-blue-500 text-white" : "bg-gray-200 text-black hover:bg-blue-200"}`}
          >
            Analisis Penjualan
          </button>

          <button
            onClick={() => setTab("purchase")}
            className={`px-4 py-2 font-semibold rounded transition-colors
              ${tab === "purchase" ? "bg-green-500 text-white" : "bg-gray-200 text-black hover:bg-green-200"}`}
          >
            Analisis Pembelian
          </button>
        </div>

        {/* Iframe hanya muncul jika tab dipilih */}
        {tab && (
          <iframe
            src={urlMap[tab]}
            style={{ width: "100%", height: "1000px", border: "none" }}
          ></iframe>
        )}
      </main>
    </div>
  );
}
