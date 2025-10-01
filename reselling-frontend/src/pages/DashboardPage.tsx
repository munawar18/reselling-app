import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import ProfitLossCard from "../components/ProfitLossCard";
import Sidebar from "../components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ProfitLossData {
  total_sales: number;
  total_purchase_cost: number;
  profit_loss: number;
  inventory_value: number;
}

export default function DashboardPage() {
  const [overall, setOverall] = useState<ProfitLossData | null>(null);
  const [currentSold, setCurrentSold] = useState<ProfitLossData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfitLoss, setShowProfitLoss] = useState(false);

  const fetchProfitLoss = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/profitLoss");
      const result = res.data;

      if (result?.success) {
        const overallData: ProfitLossData = {
          total_sales: Number(result.total_sales ?? 0),
          total_purchase_cost: Number(result.total_purchase_cost ?? 0),
          inventory_value: Number(result.inventory_value ?? 0),
          profit_loss: Number(result.overall_profit_loss ?? 0),
        };

        const currentSoldData: ProfitLossData = {
          total_sales: overallData.total_sales,
          total_purchase_cost:
            overallData.total_purchase_cost - overallData.inventory_value,
          inventory_value: overallData.inventory_value,
          profit_loss: Number(result.profit_on_sold ?? 0),
        };

        setOverall(overallData);
        setCurrentSold(currentSoldData);
      } else {
        alert("Failed to fetch profit/loss data.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to fetch profit/loss");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfitLoss();
  }, []);

  const chartData = [
    {
      name: "Profit Comparison",
      "Overall Profit/Loss": overall?.profit_loss ?? 0,
      "Current Sold Profit": currentSold?.profit_loss ?? 0,
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        isOpen={sidebarOpen}
        toggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div style={{ flex: 1, padding: "20px" }}>
        <h1>🏠 Dashboard</h1>

        {/* Chart always visible */}
        <div style={{ width: "100%", height: 300, marginBottom: "20px" }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Overall Profit/Loss" fill="#82ca9d" />
              <Bar dataKey="Current Sold Profit" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setShowProfitLoss(!showProfitLoss)}
          style={{
            marginBottom: "20px",
            padding: "8px 16px",
            background: "#1e293b",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {showProfitLoss ? "Hide Profit/Loss" : "Show Profit/Loss"}
        </button>

        {/* Profit/Loss Section */}
        {loading ? (
          <p>Loading dashboard...</p>
        ) : !overall || !currentSold ? (
          <p>No data available.</p>
        ) : (
          showProfitLoss && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <ProfitLossCard title="Overall Profit / Loss" data={overall} />
              <ProfitLossCard title="Current Sold Items Profit" data={currentSold} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
