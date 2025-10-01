const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// ➤ GET all sales
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select(
        "id, customer_name, quantity_sold, selling_price, purchase_price, sale_date, items(id,name,design_code)"
      )
      .order("id", { ascending: true });
    if (error) throw error;
    res.json({ success: true, sales: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ➤ POST a sale (with stock reduction + fetch purchase_price from items)
router.post("/", async (req, res) => {
  try {
    const { item_id, customer_name, quantity_sold = 0, selling_price = 0 } = req.body;

    const { data: item, error: itemErr } = await supabase
      .from("items")
      .select("*")
      .eq("id", item_id)
      .single();
    if (itemErr) throw itemErr;
    if (!item) return res.status(404).json({ success: false, error: "Item not found" });

    if (quantity_sold > item.quantity) {
      return res.status(400).json({ success: false, error: "Not enough stock" });
    }

    const { data, error } = await supabase
      .from("sales")
      .insert([{
        item_id,
        customer_name,
        quantity_sold,
        selling_price,
        purchase_price: item.purchase_price, // auto fetch from items
      }])
      .select();
    if (error) throw error;

    const sale = data[0];

    await supabase
      .from("items")
      .update({ quantity: item.quantity - quantity_sold })
      .eq("id", item_id);

    res.status(200).json({ success: true, sale });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ➤ DELETE a sale (restore stock)
router.delete("/:id", async (req, res) => {
  try {
    const saleId = parseInt(req.params.id);

    const { data: sale, error: saleErr } = await supabase
      .from("sales")
      .select("*")
      .eq("id", saleId)
      .single();
    if (saleErr) throw saleErr;
    if (!sale) return res.status(404).json({ success: false, error: "Sale not found" });

    const { data: item, error: itemErr } = await supabase
      .from("items")
      .select("*")
      .eq("id", sale.item_id)
      .single();
    if (itemErr) throw itemErr;

    await supabase
      .from("items")
      .update({ quantity: item.quantity + sale.quantity_sold })
      .eq("id", item.id);

    await supabase.from("sales").delete().eq("id", saleId);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
