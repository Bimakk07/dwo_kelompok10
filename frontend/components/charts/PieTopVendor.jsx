"use client";
import { useState } from "react";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

export default function PieTopVendor({ data }) {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [productData, setProductData] = useState([]);

  if (!data || data.length === 0) return <p className="text-center">Loading...</p>;

  // Format data utama
  const formatted = data.map(v => ({
    id: v.id,
    name: v.name,
    value: parseFloat(v.total),
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#DD3B36"];

  const handleSliceClick = (entry) => {
    if (!entry?.payload) return;

    const vendorId = entry.payload.id;
    const vendorName = entry.payload.name;

    setSelectedVendor({ id: vendorId, name: vendorName });

    fetch(`http://localhost:5000/api/purchase/vendor/${vendorId}/top-product`)
      .then(res => res.json())
      .then(json => {
        const topProducts = json
          .sort((a, b) => parseFloat(b.total) - parseFloat(a.total))
          .map(p => ({
            product: p.product,
            qty: p.qty,
            total: parseFloat(p.total),
          }));

        setProductData(topProducts);
      })
      .catch(err => console.error("Fetch vendor products error:", err));
  };

  const closeDrilldown = () => {
    setSelectedVendor(null);
    setProductData([]);
  };

  return (
    <div className="p-6 rounded-lg shadow border bg-white text-black">
      <h2 className="font-bold mb-4 text-lg text-center">Top 5 Vendor Purchase</h2>

      {/* MAIN PIE CHART */}
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={formatted}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label={false}
            onClick={handleSliceClick}
          >
            {formatted.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                cursor="pointer"
              />
            ))}
          </Pie>

          {/* Tooltip dengan format Indonesia */}
          <Tooltip
            formatter={(value, name) => {
              return [` ${Number(value).toLocaleString("id-ID")}`, `${name} Total`];
            }}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* DRILLDOWN — LIST PRODUK */}
      {selectedVendor && productData.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">
              Produk Vendor: {selectedVendor.name}
            </h3>
            <button
              onClick={closeDrilldown}
              className="text-red-500 font-semibold hover:underline"
            >
              Tutup
            </button>
          </div>

          <table className="w-full mt-4 border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Produk</th>
                <th className="p-2 border">Qty</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((item, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border">{item.product}</td>
                  <td className="p-2 border">{item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
