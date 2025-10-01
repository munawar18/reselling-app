// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const itemsRouter = require('./routes/items');
const salesRouter = require('./routes/sales');
const profitRouter = require('./routes/profitLoss');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/items', itemsRouter);
app.use('/api/sales', salesRouter);
app.use('/api/profitLoss', profitRouter);

app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
