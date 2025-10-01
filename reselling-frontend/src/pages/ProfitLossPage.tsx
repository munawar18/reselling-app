// src/pages/ProfitLossPage.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosClient from "../api/axiosClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ProfitLossData {
  total_sales: number;
  total_purchase_cost: number;
  inventory_value: number;
  profit_on_sold: number;
  overall_profit_loss: number;
}

const ProfitLossPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState<ProfitLossData>({
    total_sales: 0,
    total_purchase_cost: 0,
    inventory_value: 0,
    profit_on_sold: 0,
    overall_profit_loss: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatNumber = (num?: number) =>
    typeof num === "number" ? num.toLocaleString() : "0";

  const fetchProfitLoss = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get("/profitLoss");
      const result = res.data;

      if (result?.success) {
        setData({
          total_sales: Number(result.total_sales ?? 0),
          total_purchase_cost: Number(result.total_purchase_cost ?? 0),
          inventory_value: Number(result.inventory_value ?? 0),
          profit_on_sold: Number(result.profit_on_sold ?? 0),
          overall_profit_loss: Number(result.overall_profit_loss ?? 0),
        });
      } else {
        setError("Failed to fetch profit/loss data.");
      }
    } catch (err: any) {
      console.error("Fetch failed:", err);
      setError("Failed to fetch profit/loss data.");
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
      "Profit on Sold": data.profit_on_sold,
      "Overall Profit/Loss": data.overall_profit_loss,
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ flex: 1, padding: "20px" }}>
        <h1>📊 Profit / Loss</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            {/* Cards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              <Card title="Total Sales" value={`₹${formatNumber(data.total_sales)}`} />
              <Card
                title="Total Purchase Cost"
                value={`₹${formatNumber(data.total_purchase_cost)}`}
              />
              <Card
                title="Inventory Value"
                value={`₹${formatNumber(data.inventory_value)}`}
              />
              <Card
                title="Profit on Sold"
                value={`₹${formatNumber(data.profit_on_sold)}`}
                highlight={data.profit_on_sold}
              />
              <Card
                title="Overall Profit / Loss"
                value={`₹${formatNumber(data.overall_profit_loss)}`}
                highlight={data.overall_profit_loss}
              />
            </div>

            {/* Comparison Chart */}
            <div style={{ marginTop: "40px", width: "100%", height: "300px" }}>
              <h2>Profit Comparison Chart</h2>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `₹${formatNumber(value)}`} />
                  <Legend />
                  <Bar dataKey="Profit on Sold" fill="#82ca9d" />
                  <Bar dataKey="Overall Profit/Loss" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface CardProps {
  title: string;
  value: string;
  highlight?: number;
}

const Card: React.FC<CardProps> = ({ title, value, highlight }) => (
  <div
    style={{
      padding: "20px",
      background: "#f8fafc",
      border: "1px solid #ddd",
      borderRadius: "12px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "120px",
    }}
  >
    <h3>{title}</h3>
    <p
      style={{
        fontSize: "18px",
        fontWeight: "bold",
        color:
          typeof highlight === "number"
            ? highlight >= 0
              ? "green"
              : "red"
            : "black",
      }}
    >
      {value}
    </p>
  </div>
);

export default ProfitLossPage;
