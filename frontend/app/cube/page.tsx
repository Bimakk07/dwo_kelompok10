"use client";

import { useState } from "react";

export default function CubePage() {
  // Tab bisa "sales" atau "purchase"
  const [tab, setTab] = useState<"sales" | "purchase" | null>(null);

  const urlMap: Record<"sales" | "purchase", string> = {
    sales: "http://localhost:8080/mondrian/testpage.jsp?query=sales",
    purchase: "http://localhost:8080/mondrian/testpage.jsp?query=purchase",
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-black mb-4">
        Cube OLAP
      </h2>
      <p className="mb-4 text-black">
        Analisis Penjualan & Pembelian Data Warehouse Adventureworks.
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
    </div>
  );
}
