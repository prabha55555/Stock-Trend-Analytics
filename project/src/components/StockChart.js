import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StockChart({ data, predictions }) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Stock Price',
        data: data.map(d => d.price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Predicted Price',
        data: predictions,
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stock Price History & Prediction'
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

export default StockChart;
