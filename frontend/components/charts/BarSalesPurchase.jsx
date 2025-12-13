"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function BarSalesPurchase({ data, title, color, drillApi }) {
  const [selectedYear, setSelectedYear] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  const handleBarClick = async (e) => {
    if (!e?.activeLabel) return;

    const year = e.activeLabel;
    setSelectedYear(year);

    try {
      const res = await fetch(`${drillApi}${year}`);
      const json = await res.json();

      const formatted = json.map((item) => ({
        month: item.month || item.Bulan,
        total: item.total,
      }));

      setMonthlyData(formatted);
    } catch (err) {
      console.error("Error fetch drilldown:", err);
    }
  };

  const closeDrilldown = () => {
    setSelectedYear(null);
    setMonthlyData([]);
  };

  return (
    <div className="p-6 rounded-lg shadow border bg-white text-black space-y-6">
      <h2 className="font-bold mb-2 text-black">{title}</h2>

      {/* ===== MAIN BAR CHART ===== */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} onClick={handleBarClick}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Year" />
          <YAxis
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
              return value;
            }}
          />
          <Tooltip
            formatter={(value) =>
              `${Number(value).toLocaleString("id-ID")}`
            }
          />

          <Legend />
          <Bar dataKey="total" fill={color || "#0ea5e9"} />
        </BarChart>
      </ResponsiveContainer>

      {/* ===== DRILLDOWN BOX (ADA CLOSE BUTTON) ===== */}
      {selectedYear && (
        <div className="border rounded-lg bg-gray-50 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-black">
              • {title} {selectedYear}
            </h3>

            <button
              onClick={closeDrilldown}
              className="text-red-600 text-sm font-semibold hover:underline"
            >
              Tutup
            </button>
          </div>

          {/* ===== DRILLDOWN LINE CHART ===== */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  `${Number(value).toLocaleString("id-ID")}`
                }
                labelFormatter={(label) => `Bulan: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke={color || "#0ea5e9"}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
