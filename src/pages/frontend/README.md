# Fraud Detection System

This project is a Transaction Fraud Analyzer built with React. It allows users to upload CSV files containing transaction data, analyze the data for potential fraud, and generate reports with visualizations.

## Features

- **File Upload**: Users can upload CSV files containing transaction data.
- **Data Analysis**: The application processes the uploaded data to identify flagged transactions and calculate risk scores.
- **Visual Reports**: Users can view a detailed analysis report, including summary statistics and charts.
- **Download Options**: Users can download the analysis report in CSV or PDF format.

## Project Structure

```
frontend
├── src
│   ├── pages
│   │   └── Analyze.js          # Main page for file upload and report generation
│   ├── components
│   │   ├── FileUpload.js       # Component for file upload functionality
│   │   ├── SummaryCards.js      # Component for displaying summary statistics
│   │   ├── RiskCharts.js        # Component for rendering risk distribution and transaction status charts
│   │   ├── TransactionTable.js   # Component for displaying detailed transaction data
│   │   └── ReportFooter.js       # Component for rendering the report footer
│   └── App.js                   # Entry point for the React application
├── package.json                  # npm configuration file
└── README.md                     # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd frontend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.