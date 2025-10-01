import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosClient from "../api/axiosClient";

interface Item {
  id: number;
  name: string;
  design_code: string;
  created_at: string;
  quantity: number;
  purchase_price: number;
}

const ItemsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [items, setItems] = useState<Item[]>([]);

  const [newItemName, setNewItemName] = useState("");
  const [newQuantity, setNewQuantity] = useState<number | "">("");
  const [newPrice, setNewPrice] = useState<number | "">("");

  const fetchItems = async () => {
    try {
      const { data } = await axiosClient.get("/items");
      setItems(data.items);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to fetch items");
    }
  };

  const addItem = async () => {
    if (!newItemName || newQuantity === "" || newPrice === "") {
      alert("Enter valid item details");
      return;
    }
    try {
      const { data } = await axiosClient.post("/items", {
        name: newItemName,
        quantity: newQuantity,
        purchase_price: newPrice,
      });
      setItems([...items, data.item]);
      setNewItemName("");
      setNewQuantity("");
      setNewPrice("");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to add item");
    }
  };

  const deleteItem = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axiosClient.delete(`/items/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to delete item");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const totalAmount = items.reduce(
    (acc, item) => acc + item.quantity * Number(item.purchase_price),
    0
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", flexDirection: "row" }}>
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ flex: 1, padding: "20px", overflowX: "hidden" }}>
        <h1>📦 Items</h1>

        {/* Add Item Form */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            style={{ padding: "8px", flex: "1 1 150px", minWidth: "120px" }}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newQuantity}
            onChange={(e) => setNewQuantity(Number(e.target.value))}
            style={{ padding: "8px", flex: "1 1 100px", minWidth: "80px" }}
          />
          <input
            type="number"
            placeholder="Purchase Price"
            value={newPrice}
            onChange={(e) => setNewPrice(Number(e.target.value))}
            style={{ padding: "8px", flex: "1 1 100px", minWidth: "80px" }}
          />
          <button
            onClick={addItem}
            style={{
              padding: "8px 12px",
              background: "#1e293b",
              color: "white",
              border: "none",
              cursor: "pointer",
              flex: "1 1 80px",
              minWidth: "80px",
            }}
          >
            Add
          </button>
        </div>

        {/* Items Table */}
        <div className="responsive-table" style={{ overflowX: "auto", width: "100%" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "700px",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr style={{ background: "#1e293b", color: "white" }}>
                <th>Name</th>
                <th>Design Code</th>
                <th>Created At</th>
                <th>Quantity</th>
                <th>Purchase Price</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "3px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  <td data-label="Name">{item.name}</td>
                  <td data-label="Design Code">{item.design_code}</td>
                  <td data-label="Created At">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td data-label="Quantity">{item.quantity}</td>
                  <td data-label="Purchase Price">₹{item.purchase_price}</td>
                  <td data-label="Total Amount">
                    ₹{item.quantity * Number(item.purchase_price)}
                  </td>
                  <td data-label="Actions">
                    <button
                      onClick={() => deleteItem(item.id)}
                      style={{
                        padding: "4px 8px",
                        background: "red",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length > 0 && (
                <tr style={{ fontWeight: "bold", background: "#f0f0f0" }}>
                  <td colSpan={5} style={{ padding: "12px", textAlign: "right" }}>
                    Total
                  </td>
                  <td>₹{totalAmount}</td>
                  <td></td>
                </tr>
              )}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "15px" }}>
                    No items yet.
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

export default ItemsPage;
