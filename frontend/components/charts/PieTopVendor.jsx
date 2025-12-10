"use client";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

export default function PieTopVendor({ data, onSliceClick }) {
  if (!data || data.length === 0) return <p>Loading...</p>;

  // Format sesuai API terbaru
  const formatted = data.map(v => ({
    id: v.id,          // dari backend: SELECT v.VendorID AS id
    name: v.name,
    value: parseFloat(v.total),
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#DD3B36"];

  return (
    <div className="p-6 rounded-lg shadow border bg-white text-black">
      <h2 className="font-bold text-center mb-4 text-lg">Top Vendor Purchase</h2>

      <ResponsiveContainer width="100%" height={330}>
        <PieChart>
          <Pie
            data={formatted}
            dataKey="value"
            nameKey="name"
            outerRadius={130}
            innerRadius={60}
            onClick={(vendor) => onSliceClick(vendor)}  // KIRIM vendor.id & vendor.name
          >
            {formatted.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                cursor="pointer"
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
