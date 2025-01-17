import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { SMA, RSI, MACD, BollingerBands } from 'technicalindicators';
import bullishImage from '../images/bullish.jpg';
import bearishImage from '../images/bearish.jpg';

function TechnicalIndicators({ data, symbol }) {
    const prices = data.map(d => d.price);
    
    // Calculate indicators
    const sma = SMA.calculate({ period: 14, values: prices });
    const rsi = RSI.calculate({ period: 14, values: prices });
    const macd = MACD.calculate({
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        values: prices
    });
    const bb = BollingerBands.calculate({
        period: 20,
        stdDev: 2,
        values: prices
    });

    // Determine if the stock is bullish or bearish
    const isBullish = () => {
        const latestPrice = prices[prices.length - 1];
        const latestSMA = sma[sma.length - 1];
        const latestRSI = rsi[rsi.length - 1];
        const latestMACD = macd[macd.length - 1];
        const latestBB = bb[bb.length - 1];

        // Example conditions for bullish/bearish determination
        if (latestPrice > latestSMA && latestRSI < 70 && latestMACD.MACD > latestMACD.signal && latestPrice > latestBB.middle) {
            return true;
        }
        return false;
    };

    const bullish = isBullish();
    const trend = bullish ? 'Bullish' : 'Bearish';

    const hasSaved = useRef(false);

    useEffect(() => {
        if (!hasSaved.current) {
            // Send the stock symbol and trend to the backend
            const saveStockTrend = async () => {
                try {
                    await axios.post('http://localhost:5000/api/stocks', { symbol, trend });
                    console.log('Stock trend saved successfully');
                    hasSaved.current = true;
                } catch (err) {
                    console.error('Error saving stock trend:', err);
                }
            };

            saveStockTrend();
        }
    }, [symbol, trend]); 
    return (
        <div className="indicators">
            <h3>Technical Indicators</h3>
            <div className="indicator">
                <h4>SMA (14)</h4>
                <p>{sma[sma.length - 1]?.toFixed(2)}</p>
            </div>
            <div className="indicator">
                <h4>RSI (14)</h4>
                <p>{rsi[rsi.length - 1]?.toFixed(2)}</p>
            </div>
            <div className="indicator">
                <h4>MACD</h4>
                <p>MACD: {macd[macd.length - 1]?.MACD?.toFixed(2)}</p>
                <p>Signal: {macd[macd.length - 1]?.signal?.toFixed(2)}</p>
            </div>
            <div className="indicator">
                <h4>Bollinger Bands</h4>
                <p>Upper: {bb[bb.length - 1]?.upper?.toFixed(2)}</p>
                <p>Middle: {bb[bb.length - 1]?.middle?.toFixed(2)}</p>
                <p>Lower: {bb[bb.length - 1]?.lower?.toFixed(2)}</p>
            </div>
          
                <div 
                    className="trending" 
                    style={{ 
                        color: bullish ? 'green' : 'red', 
                        backgroundImage: `url(${bullish ? bullishImage : bearishImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        
                        
                    }}
                >
                    <h4 style={{ color: 'white' }}>Trend</h4>
                    <p>{trend}</p>
                
            </div>
        </div>
    );
}

export default TechnicalIndicators;
