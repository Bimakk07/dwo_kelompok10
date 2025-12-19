"use client";
import { useState } from "react";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function PieTopCustomer({ data }) {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [productData, setProductData] = useState([]);

    if (!data || data.length === 0) return <p className="text-center">Loading...</p>;

    const formatted = data.map(c => ({
        name: c.customer,
        id: c.customer_id,
        Total: parseFloat(c.total),
    }));

    const COLORS = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6"];

    const handleSliceClick = (entry) => {
        if (!entry || !entry.payload) return;

        const customerId = entry.payload.id;
        const customerName = entry.payload.name;

        setSelectedCustomer({ id: customerId, name: customerName });

        fetch(`http://localhost:5000/api/sales/customer/${customerId}`)
            .then(res => res.json())
            .then(json => {
                const top10 = json
                    .sort((a, b) => parseFloat(b.total) - parseFloat(a.total))
                    .slice(0, 10)
                    .map(p => ({
                        product: p.product,
                        qty: p.qty,
                        Total: parseFloat(p.total),
                    }));
                setProductData(top10);
            })
            .catch(err => console.error("Fetch customer products error:", err));
    };

    const closeDrilldown = () => {
        setSelectedCustomer(null);
        setProductData([]);
    };

    return (
        <div className="p-6 rounded-lg shadow border bg-white text-black">
            <h2 className="font-bold mb-4 text-lg text-center">Top 5 Customer Sales</h2>

            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={formatted}
                        dataKey="Total"
                        nameKey="name"
                        outerRadius={120}
                        label={false}
                        onClick={handleSliceClick}
                    >
                        {formatted.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} cursor="pointer" />
                        ))}
                    </Pie>

                    {/* Tooltip format Nama Total : Rp ... */}
                    <Tooltip
                        formatter={(value, name) => {
                            return [` ${Number(value).toLocaleString("id-ID")}`, `${name} Total`];
                        }}
                    />

                    {/* Legend  menampilkan nama */}
                    <Legend
                        formatter={(value, entry) => entry?.payload?.name || value}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Drilldown Top 10 Products */}
            {selectedCustomer && productData.length > 0 && (
                <div className="mt-10">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">
                            Top 10 Produk yang dibeli : {selectedCustomer.name}
                        </h3>
                        <button
                            onClick={closeDrilldown}
                            className="text-red-500 font-semibold hover:underline"
                        >
                            Close
                        </button>
                    </div>

                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            data={productData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="product" angle={-45} textAnchor="end" interval={0} />
                            <YAxis tickFormatter={(value) => value.toLocaleString()} />
                            <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
                            <Bar dataKey="Total" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>

                    <table className="w-full mt-4 border">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2 border">Produk</th>
                                <th className="p-2 border">Qty</th>
                                <th className="p-2 border">Total (Rp)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((item, index) => (
                                <tr key={index} className="border">
                                    <td className="p-2 border">{item.product}</td>
                                    <td className="p-2 border">{item.qty}</td>
                                    <td className="p-2 border">{item.Total.toLocaleString("id-ID")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
