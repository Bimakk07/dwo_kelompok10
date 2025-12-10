"use client";
import { useState } from "react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell 
} from "recharts";

export default function BarTopProduct({ data }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productTrend, setProductTrend] = useState([]);

  if (!data || !Array.isArray(data) || data.length === 0) return "Loading...";

  // Ambil 5 produk teratas
  const topData = data.slice(0, 5);
  const formatted = topData.map(d => ({
    name: d.ProductName,
    value: Number(d.total)
  }));

  const COLORS = ["#ff0000ff", "#f46600ff", "#EAB308", "#95f800ff", "#00ff6aff"];

  const handleBarClick = (entry) => {
    if (!entry || !entry.name) return;
    const productName = entry.name;
    setSelectedProduct(productName);

    // Fetch drilldown tren penjualan per bulan
    fetch(`http://localhost:5000/api/sales/product/${encodeURIComponent(productName)}/monthly`)
      .then(res => res.json())
      .then(json => setProductTrend(json))
      .catch(err => console.error("Fetch error:", err));
  };

  const closeProductDrilldown = () => {
    setSelectedProduct(null);
    setProductTrend([]);
  };

  return (
    <div className="p-6 rounded-lg shadow border bg-white text-black">
      <h2 className="font-bold text-center mb-4 text-lg">Top Product Sales</h2>

      {/* Top Product BarChart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={formatted}>
          <XAxis dataKey="name" interval={0} angle={-35} textAnchor="end" height={80} />
          <YAxis tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
            return value;
          }} />
          <Tooltip formatter={(value) => Number(value).toLocaleString()} />
          <Bar dataKey="value" onClick={handleBarClick}>
            {formatted.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} cursor="pointer" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Drilldown Tren Penjualan Bulanan */}
      {selectedProduct && productTrend.length > 0 && (
        <div className="mt-10">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-lg">
              Tren Penjualan Bulanan: {selectedProduct}
            </h3>
            <button 
              onClick={closeProductDrilldown} 
              className="text-red-500 font-semibold hover:underline"
            >
              Tutup
            </button>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={productTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthYear" />
              <YAxis tickFormatter={(value) => Number(value).toLocaleString()} />
              <Tooltip formatter={(value) => Number(value).toLocaleString()} />
              <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="#3B82F6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
