import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosClient from "../api/axiosClient";

interface Item {
  id: number;
  name: string;
  design_code: string;
  purchase_price: number;
}

interface Sale {
  id: number;
  customer_name: string;
  quantity_sold: number;
  selling_price: number;
  purchase_price: number;
  sale_date: string;
  items: Item;
}

const SalesPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const [newSale, setNewSale] = useState({
    item_id: "",
    customer_name: "",
    quantity_sold: "",
    selling_price: "",
    purchase_price: 0,
  });

  const fetchSales = async () => {
    try {
      const { data } = await axiosClient.get("/sales");
      setSales(data.sales);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to fetch sales");
    }
  };

  const fetchItems = async () => {
    try {
      const { data } = await axiosClient.get("/items");
      setItems(data.items);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to fetch items");
    }
  };

  const handleItemChange = (itemId: string) => {
    const selected = items.find((i) => i.id === Number(itemId));
    setNewSale({
      ...newSale,
      item_id: itemId,
      purchase_price: selected?.purchase_price || 0,
    });
  };

  const addSale = async () => {
    if (!newSale.item_id || !newSale.customer_name || !newSale.quantity_sold || !newSale.selling_price) {
      alert("Enter valid sale details");
      return;
    }
    try {
      await axiosClient.post("/sales", {
        ...newSale,
        quantity_sold: Number(newSale.quantity_sold),
        selling_price: Number(newSale.selling_price),
      });
      fetchSales();
      setNewSale({ item_id: "", customer_name: "", quantity_sold: "", selling_price: "", purchase_price: 0 });
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to add sale");
    }
  };

  const deleteSale = async (id: number) => {
    if (!window.confirm("Delete this sale?")) return;
    try {
      await axiosClient.delete(`/sales/${id}`);
      fetchSales();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to delete sale");
    }
  };

  useEffect(() => {
    fetchSales();
    fetchItems();
  }, []);

  const totalAmount = sales.reduce(
    (acc, sale) => acc + Number(sale.quantity_sold) * Number(sale.selling_price),
    0
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ flex: 1, padding: "20px", overflowX: "hidden" }}>
        <h1>💰 Sales</h1>

        {/* Add Sale Form */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <select
            value={newSale.item_id}
            onChange={(e) => handleItemChange(e.target.value)}
            style={{ padding: "8px", flex: "1 1 150px", minWidth: "120px" }}
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.design_code})
              </option>
            ))}
          </select>

          <p style={{ padding: "8px", margin: 0 }}>₹{newSale.purchase_price}</p>

          <input
            type="text"
            placeholder="Customer Name"
            value={newSale.customer_name}
            onChange={(e) => setNewSale({ ...newSale, customer_name: e.target.value })}
            style={{ padding: "8px", flex: "1 1 150px", minWidth: "100px" }}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newSale.quantity_sold}
            onChange={(e) => setNewSale({ ...newSale, quantity_sold: e.target.value })}
            style={{ padding: "8px", flex: "1 1 100px", minWidth: "80px" }}
          />
          <input
            type="number"
            placeholder="Selling Price"
            value={newSale.selling_price}
            onChange={(e) => setNewSale({ ...newSale, selling_price: e.target.value })}
            style={{ padding: "8px", flex: "1 1 100px", minWidth: "80px" }}
          />
          <button
            onClick={addSale}
            style={{
              padding: "8px 12px",
              background: "#1e293b",
              color: "white",
              border: "none",
              cursor: "pointer",
              flex: "0 0 auto",
            }}
          >
            Add
          </button>
        </div>

        {/* Sales Table */}
        <div className="responsive-table" style={{ overflowX: "auto", width: "100%" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "700px",
            }}
          >
            <thead>
              <tr style={{ background: "#1e293b", color: "white" }}>
                <th>Item</th>
                <th>Customer</th>
                <th>Quantity</th>
                <th>Purchase Price</th>
                <th>Selling Price</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr
                  key={sale.id}
                  style={{
                    borderBottom: "3px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <td data-label="Item">
                    {sale.items?.name} ({sale.items?.design_code})
                  </td>
                  <td data-label="Customer">{sale.customer_name}</td>
                  <td data-label="Quantity">{sale.quantity_sold}</td>
                  <td data-label="Purchase Price">₹{sale.purchase_price}</td>
                  <td data-label="Selling Price">₹{sale.selling_price}</td>
                  <td data-label="Total">
                    ₹{Number(sale.quantity_sold) * Number(sale.selling_price)}
                  </td>
                  <td data-label="Date">{new Date(sale.sale_date).toLocaleDateString()}</td>
                  <td data-label="Actions">
                    <button
                      onClick={() => deleteSale(sale.id)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))}
              {sales.length > 0 && (
                <tr style={{ fontWeight: "bold", background: "#f0f0f0" }}>
                  <td colSpan={5} style={{ padding: "12px", textAlign: "right" }}>
                    Total Selling
                  </td>
                  <td>₹{totalAmount}</td>
                  <td colSpan={2}></td>
                </tr>
              )}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "15px" }}>
                    No sales yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
