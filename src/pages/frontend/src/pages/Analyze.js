import React, { useState, useRef } from 'react';
import { Container, Typography, Button, LinearProgress, Alert, Box, Paper, Grid } from '@mui/material';
import axios from 'axios';
import Papa from 'papaparse';
import FileUpload from '../components/FileUpload';
import SummaryCards from '../components/SummaryCards';
import RiskCharts from '../components/RiskCharts';
import TransactionTable from '../components/TransactionTable';
import ReportFooter from '../components/ReportFooter';

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const reportRef = useRef();

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://127.0.0.1:8000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setResults(res.data);
      generateSummary(res.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to analyze CSV. Please check your file format.");
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = (data) => {
    const total = data.length;
    const flagged = data.filter(r => r.flagged).length;
    const totalAmount = data.reduce((sum, r) => sum + Number(r.amount), 0);
    const avgRisk = (data.reduce((sum, r) => sum + Number(r.risk_score), 0) / total).toFixed(2);
    const highRisk = data.filter(r => r.risk_score >= 30).length;

    setSummary({
      total,
      flagged,
      totalAmount: totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      avgRisk,
      highRisk,
      flaggedPercentage: ((flagged / total) * 100).toFixed(1)
    });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        Transaction Fraud Analyzer
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <FileUpload 
          fileName={fileName}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          loading={loading}
        />
        {error && (<Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>)}
        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </Paper>

      {results.length > 0 && (
        <Box ref={reportRef}>
          <SummaryCards summary={summary} />
          <RiskCharts results={results} />
          <TransactionTable results={results} />
          <ReportFooter />
        </Box>
      )}
    </Container>
  );
}