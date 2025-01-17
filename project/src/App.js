import { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import StockSearch from './components/StockSearch.js';
import StockChart from './components/StockChart.js';
import TechnicalIndicators from './components/TechnicalIndicators.js';
import { fetchStockData } from './api/stockApi.js';
import './App.css';
import increase_stock from './video/increase_stock.mp4';

function App() {
  const [stockData, setStockData] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStockSearch = async (symbol) => {
    setLoading(true);
    setError('');
    setSymbol(symbol);
    try {
      const data = await fetchStockData(symbol);
      console.log('Fetched stock data:', data);
      setStockData(data);
      makePrediction(data.map(d => d.price));
      saveStockSymbol(symbol);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Error fetching stock data. Please ensure you entered a valid BSE stock symbol.');
    }
    setLoading(false);
  };

  const makePrediction = async (prices) => {
    try {
      const xs = tf.tensor2d([...Array(prices.length).keys()], [prices.length, 1]);
      const ys = tf.tensor2d(prices, [prices.length, 1]);

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 8, inputShape: [1], activation: 'relu' }));
      model.add(tf.layers.dense({ units: 1 }));

      model.compile({ 
        loss: 'meanSquaredError', 
        optimizer: tf.train.adam(0.01)
      });

      await model.fit(xs, ys, { 
        epochs: 100,
        batchSize: 32,
        shuffle: true
      });

      const lastDay = prices.length - 1;
      const prediction = model.predict(tf.tensor2d([lastDay + 1], [1, 1]));
      
      setPredictions([...Array(prices.length - 1).fill(null), prices[prices.length - 1], prediction.dataSync()[0]]);
    } catch (err) {
      console.error('Error generating prediction:', err);
      setError('Error generating prediction. Please try again.');
    }
  };

  const saveStockSymbol = async (symbol) => {
    try {
      const response = await fetch('http://localhost:5000/api/stocks', { // Ensure the URL is correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symbol })
      });
      const data = await response.json();
      console.log('Stock symbol saved successfully:', data);
    } catch (err) {
      console.error('Error saving stock symbol:', err);
    }
  };

  return (
    <div className="app">
      <video autoPlay loop muted className="background-video">
        <source src={increase_stock} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h1>Indian Stock Trend Analysis</h1>
      <p className="subtitle">Enter BSE stock symbol (e.g., TCS, RELIANCE, INFY)</p>
      <StockSearch onSearch={handleStockSearch} />
      
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      
      {stockData.length > 0 && (
        <>
          <div className="current-price">
            <h2>Current Price: ₹{stockData[stockData.length - 1].price.toFixed(2)}</h2>
            {predictions.length > 0 && (
              <h3>Predicted : ₹{predictions[predictions.length - 1].toFixed(2)}</h3>
            )}
          </div>
          
          <div className="chart-container">
            <StockChart data={stockData} predictions={predictions} />
          </div>
          
          <TechnicalIndicators data={stockData} symbol={symbol} />
        </>
      )}
    </div>
  );
}

export default App;
