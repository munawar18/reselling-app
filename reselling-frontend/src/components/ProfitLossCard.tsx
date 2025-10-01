interface ProfitLossData {
  total_sales?: number;
  total_purchase_cost?: number;
  profit_loss?: number;
  inventory_value?: number;
}

interface ProfitLossProps {
  title: string;
  data?: ProfitLossData; // optional to handle undefined
}

export default function ProfitLossCard({ title, data }: ProfitLossProps) {
  const formatNumber = (num?: number) => (typeof num === "number" ? num.toLocaleString() : "0");

  if (!data) {
    return (
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          width: "300px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>{title}</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        width: "300px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2>{title}</h2>
      <p>Total Sales: ₹{formatNumber(data.total_sales)}</p>
      <p>Total Purchase Cost: ₹{formatNumber(data.total_purchase_cost)}</p>
      <p>Profit / Loss: ₹{formatNumber(data.profit_loss)}</p>
      <p>Inventory Value: ₹{formatNumber(data.inventory_value)}</p>
    </div>
  );
}
