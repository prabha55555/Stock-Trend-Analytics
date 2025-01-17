# Indian Stock Trend Analysis

This project is a web application that allows users to analyze and predict stock prices for Indian stocks listed on the BSE (Bombay Stock Exchange). The application fetches historical stock data, uses TensorFlow.js to create and train a neural network model, and predicts future stock prices based on the historical data.

## Features

- Fetches historical stock data from the Alpha Vantage API
- Uses TensorFlow.js to create and train a neural network model
- Predicts future stock prices based on historical data
- Displays current and predicted stock prices
- Visualizes stock data and predictions using charts

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/prabha55555/Stock-Trend-Analytics.git
    cd project
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Start the application:**

    ```bash
    npm start
    ```

## Usage

1. Enter a BSE stock symbol (e.g., TCS, RELIANCE, INFY) in the search bar.
2. View the current and predicted stock prices.
3. Analyze the stock data and predictions using the provided charts.

## Tech Stack

**Frontend:**

- **React:** A JavaScript library for building user interfaces. It is used to create the components and manage the state of the application.
- **TensorFlow.js:** A JavaScript library for training and deploying machine learning models in the browser. It is used to create and train the neural network model for predicting stock prices.
- **Axios:** A promise-based HTTP client for the browser and Node.js. It is used to fetch stock data from the Alpha Vantage API.

**Backend:**

- **AlphaVantage API:** A service that provides real-time and historical stock market data. It is used to fetch historical stock data for the BSE stocks.

## License

This project is licensed under the MIT License.
