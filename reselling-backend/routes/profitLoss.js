// profitLoss.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// GET /api/profitLoss
router.get("/", async (req, res) => {
  try {
    // Fetch items
    const { data: items = [], error: itemsErr } = await supabase
      .from("items")
      .select("id, quantity, purchase_price");
    if (itemsErr) throw itemsErr;

    // Fetch sales
    const { data: sales = [], error: salesErr } = await supabase
      .from("sales")
      .select("item_id, quantity_sold, selling_price, purchase_price");
    if (salesErr) throw salesErr;

    let totalPurchaseCost = 0;
    let totalSales = 0;
    let inventoryValue = 0;
    let costOfSoldItems = 0;

    // Calculate purchase & inventory values
    items.forEach((item) => {
      const soldQty = sales
        .filter((s) => s.item_id === item.id)
        .reduce((acc, s) => acc + Number(s.quantity_sold), 0);

      const totalEverPurchased = Number(item.quantity) + soldQty;

      totalPurchaseCost += Number(item.purchase_price) * totalEverPurchased;
      inventoryValue += Number(item.purchase_price) * Number(item.quantity);
    });

    // Calculate sales revenue & cost of sold items
    sales.forEach((s) => {
      totalSales += Number(s.quantity_sold) * Number(s.selling_price);
      costOfSoldItems += Number(s.quantity_sold) * Number(s.purchase_price);
    });

    // Profit/Loss on sold items
    const profitOnSold = totalSales - costOfSoldItems;

    // Overall Profit/Loss = (Sales Revenue + Current Inventory Value) – Total Purchase Cost
    const overallProfitLoss = totalSales + inventoryValue - totalPurchaseCost;

    res.json({
      success: true,
      total_purchase_cost: totalPurchaseCost || 0,
      total_sales: totalSales || 0,
      inventory_value: inventoryValue || 0,
      profit_on_sold: profitOnSold || 0,
      overall_profit_loss: overallProfitLoss || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
