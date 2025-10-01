// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const itemsRouter = require('./routes/items');
const salesRouter = require('./routes/sales');
const profitRouter = require('./routes/profitLoss');

const app = express();

// ✅ Allow requests only from your frontend
app.use(cors({
  origin: "https://reselling-frontend.onrender.com", // replace with your frontend Render URL
}));

app.use(express.json());

app.use('/api/items', itemsRouter);
app.use('/api/sales', salesRouter);
app.use('/api/profitLoss', profitRouter);

app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
