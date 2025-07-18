from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import tempfile
import logging
from typing import List, Dict, Any
import os
from fraud_detector import FraudDetector  # Make sure this file exists

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize fraud detector
detector = FraudDetector()

def validate_csv_data(df: pd.DataFrame) -> bool:
    """Validate that required columns exist in the CSV"""
    required_columns = {'user_id', 'amount', 'timestamp', 'location_lat', 'location_lon'}
    if not required_columns.issubset(df.columns):
        missing = required_columns - set(df.columns)
        raise ValueError(f"Missing required columns: {missing}")
    return True

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)) -> List[Dict[str, Any]]:
    """
    Analyze CSV file for fraudulent transactions.
    Only debit transactions (amount < 0) are analyzed.
    Expected CSV format:
    user_id,amount,timestamp,location_lat,location_lon
    """
    try:
        detector = FraudDetector()  # NEW INSTANCE for every request

        logger.info(f"Processing file: {file.filename}")
        content = await file.read()

        with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        try:
            df = pd.read_csv(
                tmp_path,
                dtype={
                    'user_id': str,
                    'amount': float,
                    'timestamp': int,
                    'location_lat': float,
                    'location_lon': float
                }
            )

            validate_csv_data(df)

            results = []
            for _, row in df.iterrows():
                try:
                    if row['amount'] >= 0:
                        logger.info(f"Skipping credited transaction from user {row['user_id']}")
                        continue

                    txn = {
                        "user_id": row['user_id'],
                        "amount": abs(row['amount']),
                        "timestamp": row['timestamp'],
                        "location_lat": row['location_lat'],
                        "location_lon": row['location_lon']
                    }

                    result = detector.detect(txn)
                    results.append(result)

                except Exception as txn_error:
                    logger.error(f"Error processing row {_ + 1}: {txn_error}")
                    continue

            return results

        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="The uploaded file is empty")
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error processing the file")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
