const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/stockstore'; 
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Stock schema and model
const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Stock = mongoose.model('Stock', stockSchema, 'details'); // Use the details collection


app.post('/api/stocks', async (req, res) => {
    const { symbol } = req.body;
    console.log('Received data:', req.body); 
    try {
        const stock = new Stock({ symbol });
        await stock.save();
        console.log('Stock saved:', stock); 
        res.status(201).json(stock);
    } catch (err) {
        console.error('Error saving stock:', err); 
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/stocks/:symbol', async (req, res) => {
    const { symbol } = req.params;
    try {
        const stock = await Stock.findOne({ symbol });
        if (!stock) {
            return res.status(404).json({ error: 'Stock not found' });
        }
        res.json(stock);
    } catch (err) {
        console.error('Error fetching stock:', err); 
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
