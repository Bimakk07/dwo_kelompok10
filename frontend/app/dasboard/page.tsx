import Sidebar from "../components/sidebar";
import Navbar from "../components/Navbar";
import CardMetric from "../components/CardMetric";

export default function Dashboard() {
  return (
    <div>
      <Sidebar />
      <Navbar />

      <div className="ml-64 p-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          <CardMetric title="Total Purchase" value="312" color="#2ECC71" />
          <CardMetric title="Total Sales" value="492" color="#3498DB" />
          <CardMetric title="Total Vendor" value="84" color="#9B59B6" />
          <CardMetric title="Total Customer" value="129" color="#E67E22" />
        </div>

        <p className="text-gray-500">📌 Grafik & Tabel akan dibuat setelah API siap</p>
      </div>
    </div>
  );
}
