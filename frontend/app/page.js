"use client";

import { useEffect, useState } from "react";
import CardStats from "@/components/CardStats";
import BarSalesPurchase from "@/components/charts/BarSalesPurchase";
import PieTopVendor from "@/components/charts/PieTopVendor";
import PieTopCustomer from "@/components/charts/PieTopCustomer";
import BarTopProduct from "@/components/charts/BarTopProduct";

export default function Home() {
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

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerProducts, setCustomerProducts] = useState([]);

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorProducts, setVendorProducts] = useState([]);

  useEffect(() => {
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
  }, []);

  // Drilldown Customer
  const fetchCustomerProducts = async (customerId, customerName) => {
    try {
      const res = await fetch(`http://localhost:5000/api/sales/customer/${customerId}`);
      const data = await res.json();
      setCustomerProducts(data);
      setSelectedCustomer(customerName);
    } catch (err) {
      console.error("Drilldown Customer Error:", err);
    }
  };

  // Drilldown Vendor
  const fetchVendorProducts = async (vendorId, vendorName) => {
    try {
      const res = await fetch(`http://localhost:5000/api/purchase/vendor/${vendorId}/top-product`);
      const data = await res.json();
      setVendorProducts(data);
      setSelectedVendor(vendorName);
    } catch (err) {
      console.error("Drilldown Vendor Error:", err);
    }
  };

  const closeDrilldown = () => {
    setSelectedCustomer(null);
    setCustomerProducts([]);
  };

  const closeVendorDrilldown = () => {
    setSelectedVendor(null);
    setVendorProducts([]);
  };

  const renderTable = (data) => (
    <table className="min-w-full divide-y divide-gray-200 border text-black">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Produk</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Qty</th>
          
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item, idx) => (
          <tr key={idx}>
            <td className="px-4 py-2">{item.product}</td>
            <td className="px-4 py-2">{item.qty}</td>
            
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl font-bold text-black">Dashboard AdventureWorks</h1>

      {/* CARD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardStats
  title="Total Sales"
  value={Math.round(stats.sales).toLocaleString("id-ID")}
/>

        <CardStats title="Total Produk" value={stats.product?.toLocaleString()} />
        <CardStats title="Total Vendor" value={stats.vendor} />
        <CardStats title="Total Customer" value={stats.customer} />
      </div>

      {/* BAR CHART */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* PIE + DRILLDOWN */}
      <div className="grid md:grid-cols-3 gap-6 items-start">

        {/* PIE TOP VENDOR + DRILLDOWN */}
        <div className="space-y-4">
          <PieTopVendor
            data={chart.topVendor}
            onSliceClick={(vendor) => fetchVendorProducts(vendor.id, vendor.name)}
          />

          {selectedVendor && (
            <div className="bg-white shadow-lg rounded-lg p-5 border border-gray-200 text-black">
              <div className="flex justify-between mb-3">
                <h2 className="text-lg font-bold">
                  Ringkasan produk Vendor: {selectedVendor}
                </h2>
                <button
                  onClick={closeVendorDrilldown}
                  className="text-red-500 text-sm font-semibold hover:underline"
                >
                  Tutup
                </button>
              </div>

              {renderTable(vendorProducts)}
            </div>
          )}
        </div>

        {/* PIE TOP CUSTOMER + DRILLDOWN */}
        <div className="space-y-4">
          <PieTopCustomer
            data={chart.topCustomer}
            onSliceClick={(customer) => fetchCustomerProducts(customer.id, customer.name)}
          />

          {selectedCustomer && (
            <div className="bg-white shadow-lg rounded-lg p-5 border border-gray-200 text-black">
              <div className="flex justify-between mb-3">
                <h2 className="text-lg font-bold">
                  Produk yang dibeli oleh: {selectedCustomer}
                </h2>
                <button
                  onClick={closeDrilldown}
                  className="text-red-500 text-sm font-semibold hover:underline"
                >
                  Tutup
                </button>
              </div>

              {renderTable(customerProducts)}
            </div>
          )}
        </div>

        {/* TOP PRODUCT BAR */}
        <BarTopProduct data={chart.topProduct} />

      </div>
    </div>
  );
}
