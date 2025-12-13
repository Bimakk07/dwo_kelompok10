"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CardStats from "@/components/CardStats";
import BarSalesPurchase from "@/components/charts/BarSalesPurchase";
import PieTopVendor from "@/components/charts/PieTopVendor";
import PieTopCustomer from "@/components/charts/PieTopCustomer";
import BarTopProduct from "@/components/charts/BarTopProduct";

export default function Home() {
  const router = useRouter();

  const [stats, setStats] = useState({
    sales: 0,
    product: 0,
    vendor: 0,
    customer: 0,
  });

  const [chart, setChart] = useState({
    salesYearly: [],
    purchaseYearly: [],
    topVendor: [],
    topCustomer: [],
    topProduct: [],
  });

  // --- CEK LOGIN & FETCH DATA ---
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      router.push("/auth");
      return;
    }

    async function fetchData() {
      try {
        const sTotal = await fetch("http://localhost:5000/api/sales/total").then(r => r.json());
        const pTotal = await fetch("http://localhost:5000/api/sales/total-product").then(r => r.json());
        const vendor = await fetch("http://localhost:5000/api/vendor/total").then(r => r.json());
        const customer = await fetch("http://localhost:5000/api/customer/total").then(r => r.json());

        const salesPerYear = await fetch("http://localhost:5000/api/sales/pertahun").then(r => r.json());
        const purchasePerYear = await fetch("http://localhost:5000/api/purchase/pertahun").then(r => r.json());

        const topVendor = await fetch("http://localhost:5000/api/purchase/top-vendor").then(r => r.json());
        const topCustomer = await fetch("http://localhost:5000/api/sales/top-customer").then(r => r.json());
        const topProduct = await fetch("http://localhost:5000/api/sales/top-product").then(r => r.json());

        setStats({
          sales: sTotal.total_sales,
          product: pTotal.total_product,
          vendor: vendor.total_vendor,
          customer: customer.total_customer,
        });

        setChart({
          salesYearly: salesPerYear,
          purchaseYearly: purchasePerYear,
          topVendor,
          topCustomer,
          topProduct,
        });
      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    }

    fetchData();
  }, [router]);

  const renderTable = (data) => (
    <table className="min-w-full border text-black">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-2 border">Produk</th>
          <th className="p-2 border">Qty</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            <td className="p-2 border">{item.product}</td>
            <td className="p-2 border">{item.qty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

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
            router.push("/auth");
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
        <h1 className="text-3xl font-bold mb-6 text-black">
          Dashboard AdventureWorks
        </h1>

        {/* CARD STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <CardStats title="Total Sales" value={Math.round(stats.sales).toLocaleString("id-ID")} />
          <CardStats title="Total Produk" value={stats.product?.toLocaleString()} />
          <CardStats title="Total Vendor" value={stats.vendor} />
          <CardStats title="Total Customer" value={stats.customer} />
        </div>

        {/* CHART */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <BarSalesPurchase
            data={chart.purchaseYearly}
            title="Purchase per Tahun"
            color="#10b981"
            drillApi="http://localhost:5000/api/purchase/monthly/"
          />
          <BarSalesPurchase
            data={chart.salesYearly}
            title="Sales per Tahun"
            color="#0ea5e9"
            drillApi="http://localhost:5000/api/sales/monthly/"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <PieTopVendor data={chart.topVendor} />
          <PieTopCustomer data={chart.topCustomer} />
          <BarTopProduct data={chart.topProduct} />
        </div>
      </main>
    </div>
  );
}
