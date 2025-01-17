import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = 'P5KD1OUWNV447D5B'; 
const baseURL = 'https://www.alphavantage.co/query';

export const fetchStockData = async (symbol) => {
  try {
    const response = await axios.get(baseURL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: `${symbol}.BSE`, 
        outputsize: 'compact',
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    if (response.data['Error Message']) {
      throw new Error('Invalid API call');
    }

    const timeSeriesData = response.data['Time Series (Daily)'];
    if (!timeSeriesData) {
      throw new Error('No data available');
    }

    return formatStockData(timeSeriesData);
  } catch (error) {
    console.error('Error fetching stock data:', error); // Log error
    throw new Error('Failed to fetch stock data');
  }
};

const formatStockData = (timeSeriesData) => {
  return Object.entries(timeSeriesData).map(([date, values]) => ({
    date: new Date(date).toLocaleDateString(),
    price: parseFloat(values['4. close']),
    volume: parseFloat(values['5. volume']),
    high: parseFloat(values['2. high']),
    low: parseFloat(values['3. low']),
    open: parseFloat(values['1. open'])
  })).reverse();
};

export const fetchIntraday = async (symbol) => {
  try {
    const response = await axios.get(baseURL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: `${symbol}.BSE`,
        interval: '5min',
        outputsize: 'compact',
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    if (response.data['Error Message']) {
      throw new Error('Invalid API call');
    }

    const timeSeriesData = response.data['Time Series (5min)'];
    if (!timeSeriesData) {
      throw new Error('No intraday data available');
    }

    return formatStockData(timeSeriesData);
  } catch (error) {
    console.error('Error fetching intraday data:', error); // Log error
    throw new Error('Failed to fetch intraday data');
  }
};