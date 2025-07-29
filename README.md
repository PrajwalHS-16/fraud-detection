
# Transaction Fraud Analyzer

A full-stack application for detecting and analyzing fraudulent financial transactions using machine learning and rule-based logic. Upload your transaction CSV, analyze for suspicious activity, and visualize risk distribution and flagged users.

## Features

- **CSV Upload:** Upload transaction data for analysis.
- **Fraud Detection:** Detects high-frequency, outlier, location anomaly, and clustered (job sequencing) fraud patterns.
- **Risk Scoring:** Assigns a risk score to each transaction.
- **Visual Analytics:** Pie and bar charts for risk distribution and flagged transactions by user.
- **Downloadable Reports:** Export detailed results as CSV.
- **Modern UI:** Built with React and Material-UI.

## How It Works

1. **Upload CSV:**  
   Upload a CSV file with columns:  
   `user_id, amount, timestamp, location_lat, location_lon`

2. **Fraud Detection:**  
   The backend (Python) analyzes each transaction for:
   - High frequency in short time
   - Outlier amounts (z-score)
   - Impossible location jumps
   - Clusters of risky transactions (job sequencing with deadlines)

3. **Results:**  
   - Each transaction is scored and flagged if risky.
   - Visual summaries and downloadable reports are generated.

## Example CSV

```csv
user_id,amount,timestamp,location_lat,location_lon
u1,-100.00,1752677000,10.0000,77.0000
u1,-5000.00,1752677060,55.7558,37.6173
...
```

## Tech Stack

- **Frontend:** React, Material-UI, recharts
- **Backend:** Python (FastAPI/Flask), custom fraud detection logic
- **Data Processing:** pandas, numpy

## Setup

### Backend

1. Install dependencies:
    ```bash
    pip install fastapi uvicorn pandas numpy
    ```
2. Run the backend:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend

1. Install dependencies:
    ```bash
    cd frontend
    npm install
    ```
2. Run the frontend:
    ```bash
    npm start
    ```

## Project Structure

```
fraud-detector-github/
├── backend/
│   ├── fraud_detector.py
│   └── main.py
├── frontend/
│   └── src/pages/Analyze.js
└── README.md
```



## License

MIT License

---


