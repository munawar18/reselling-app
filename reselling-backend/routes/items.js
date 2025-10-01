const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Helper to generate design code
function generateDesignCode(name) {
  const words = name.trim().split(' ');
  const initials = words.map(w => w[0].toUpperCase()).join('');
  const randomNum = Math.floor(10 + Math.random() * 90); // 2-digit number
  return `${initials}${randomNum}`;
}

// Get all items
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    res.json({ success: true, items: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add item
router.post('/', async (req, res) => {
  try {
    const { name, quantity = 0, purchase_price = 0 } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'name is required' });

    const design_code = generateDesignCode(name);

    const { data, error } = await supabase
      .from('items')
      .insert([{ name, quantity, purchase_price, design_code }])
      .select();
    if (error) throw error;
    res.json({ success: true, item: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update item (name, price, quantity)
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    // If name is updated, regenerate design_code
    if (updates.name) {
      updates.design_code = generateDesignCode(updates.name);
    }

    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    res.json({ success: true, item: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete item and reorder IDs
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Delete the item
    const { error: delError } = await supabase.from('items').delete().eq('id', id);
    if (delError) throw delError;

    // Reorder IDs (optional: use Supabase RPC or manual update)
    const { data: items, error: itemsErr } = await supabase
      .from('items')
      .select('*')
      .order('id', { ascending: true });
    if (itemsErr) throw itemsErr;

    for (let i = 0; i < items.length; i++) {
      if (items[i].id !== i + 1) {
        await supabase.from('items').update({ id: i + 1 }).eq('id', items[i].id);
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
