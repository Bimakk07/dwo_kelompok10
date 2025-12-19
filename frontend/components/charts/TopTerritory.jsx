"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export default function TopTeritori() {
    const [data, setData] = useState([]);
    const [topTerritory, setTopTerritory] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("http://localhost:5000/api/sales/territory");
                const json = await res.json();

                // SORT DESC & AMBIL TOP 5
                const sorted = [...json].sort((a, b) => b.total - a.total);
                const top5 = sorted.slice(0, 5);

                setData(top5);
                setTopTerritory(top5[0]);
            } catch (err) {
                console.error("Error fetch territory:", err);
            }
        }

        fetchData();
    }, []);

    if (!topTerritory) return null;

    return (
        <div className="bg-white border border-black rounded-lg p-6">

            {/* ===== BOX ANALISIS ===== */}
            <div className="border border-green-600 rounded-md p-4 mb-6 bg-green-50">
                <p className="font-semibold text-green-700">
                    Wilayah dengan penjualan tertinggi:
                </p>

                <p className="text-xl font-bold text-green-800">
                    {topTerritory.territory}
                </p>

                <p className="text-green-700">
                    Total Penjualan:{" "}
                    <span className="font-semibold">
                        {Number(topTerritory.total).toLocaleString("id-ID")}
                    </span>
                </p>
            </div>

            {/* ===== JUDUL CHART ===== */}
            <h2 className="text-lg font-bold mb-4 text-black">
                Top 5 Wilayah Berdasarkan Penjualan
            </h2>

            {/* ===== CHART ===== */}
            <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="territory"
                            tick={{ fill: "#000", fontSize: 12 }}
                        />
                        <YAxis
                            tick={{ fill: "#000", fontSize: 12 }}
                        />
                        <Tooltip
                            labelStyle={{ color: "#000", fontWeight: "" }}   
                            itemStyle={{ color: "#000" }}                      
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #000",
                            }}
                            formatter={(value) =>
                                ` ${Number(value).toLocaleString("id-ID")}`
                            }
                        />
                        <Bar
                            dataKey="total"
                            fill="#1992e3f5"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
