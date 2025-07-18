import React, { useState, useRef } from 'react';
import {
  Container, Typography, Button, Grid, Paper, LinearProgress, Alert, Card, CardContent,
  Input, FormControl, InputLabel, Box, Divider
} from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const reportRef = useRef();
  const theme = useTheme();

  const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#118AB2', '#073B4C'];

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
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

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(results);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "fraud_report.csv";
    link.click();
  };

  // Prepare data for charts
  const flaggedData = [
    { name: 'Flagged', value: results.filter(r => r.flagged).length },
    { name: 'Not Flagged', value: results.filter(r => !r.flagged).length }
  ];

  const riskData = results.map(r => ({
    user_id: r.user_id,
    risk_score: r.risk_score,
    color: r.flagged ? '#FF6B6B' : '#4ECDC4'
  }));

  // Only show flagged vs not flagged in risk distribution
  const riskDistribution = [
    { name: 'Flagged', value: results.filter(r => r.flagged).length },
    { name: 'Not Flagged', value: results.filter(r => !r.flagged).length }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main, textAlign: 'center', mb: 4 }}>
        Transaction Fraud Analyzer
      </Typography>

      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
          borderRadius: 3,
          background: "linear-gradient(90deg, #232526 0%, #414345 100%)",
          color: "#fff"
        }}
      >
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={7}>
            <FormControl fullWidth>
              <InputLabel htmlFor="file-upload" shrink sx={{ color: "#FFD166" }}>
                Upload CSV File
              </InputLabel>
              <Input
                id="file-upload"
                type="file"
                accept=".csv"
                sx={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadIcon />}
                  sx={{
                    bgcolor: "#FFD166",
                    color: "#232526",
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                    boxShadow: 2,
                    '&:hover': { bgcolor: "#FF6B6B", color: "#fff" }
                  }}
                >
                  Choose File
                  <input type="file" accept=".csv" hidden onChange={handleFileChange} />
                </Button>
                <Typography variant="body1" sx={{ color: "#FFD166", fontWeight: 500 }}>
                  {fileName || "No file chosen"}
                </Typography>
              </Box>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={loading || !file}
              startIcon={<UploadIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                bgcolor: "#4ECDC4",
                color: "#232526",
                boxShadow: 2,
                '&:hover': { bgcolor: "#118AB2", color: "#fff" }
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze Transactions'}
            </Button>
          </Grid>
        </Grid>

        {error && (<Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>)}
        {loading && <LinearProgress sx={{ mt: 3, bgcolor: "#FFD166" }} />}
      </Paper>

      {results.length > 0 && summary && (
        <Paper
          ref={reportRef}
          elevation={6}
          sx={{
            bgcolor: "#181A20",
            color: "#fff",
            borderRadius: 4,
            p: { xs: 2, md: 4 },
            mt: 2,
            boxShadow: "0 8px 32px 0 rgba(255,23,68,0.15)"
          }}
        >
          {/* Report Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              FRAUD ANALYSIS REPORT
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "grey.400" }}>
              Generated on {new Date().toLocaleDateString()}
            </Typography>
          </Box>

          {/* Executive Summary Cards */}
          <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ mb: 4 }}>
            {[
              {
                label: "Total Transactions",
                value: summary.total,
                color: "#fff"
              },
              {
                label: "Flagged Transactions",
                value: summary.flagged,
                color: "#FF6B6B",
                sub: `(${summary.flaggedPercentage}% of total)`
              },
              {
                label: "Total Amount",
                value: `₹${summary.totalAmount}`,
                color: "#FFD166"
              },
              {
                label: "Avg. Risk Score",
                value: summary.avgRisk,
                color: "#4ECDC4"
              }
            ].map((card, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card
                  sx={{
                    height: "100%",
                    bgcolor: "#232526",
                    color: card.color,
                    border: "1px solid #333",
                    boxShadow: 4,
                    borderRadius: 3
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="grey.400" sx={{ mb: 1 }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: card.sub ? 1 : 0 }}>
                      {card.value}
                    </Typography>
                    {card.sub && (
                      <Typography variant="body2" color="grey.400">
                        {card.sub}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: { xs: 3, md: 4 },
                  height: "100%",
                  bgcolor: "#232526",
                  color: "#fff",
                  border: "1px solid #333",
                  boxShadow: 4,
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Typography variant="h6" align="center" sx={{ mb: 3, fontWeight: 700, letterSpacing: 1 }}>
                  Risk Distribution
                </Typography>
                <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <ResponsiveContainer width="90%" height={220}>
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} transactions`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ width: "100%", mt: 3, mb: 2, display: "flex", justifyContent: "center" }}>
                    <Legend
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      iconSize={18}
                      payload={riskDistribution.map((item, i) => ({
                        value: item.name,
                        type: "square",
                        color: COLORS[i % COLORS.length],
                      }))}
                    />
                  </Box>
                </Box>
                <Divider sx={{ my: 2, bgcolor: "#FFD166", width: "80%" }} />
                <Typography variant="body2" align="center" sx={{ color: "#FFD166", fontWeight: 500 }}>
                  {`Most transactions are ${riskDistribution.reduce((a, b) => a.value > b.value ? a : b).name}.`}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: "100%", bgcolor: "#232526", color: "#fff", border: "1px solid #333", boxShadow: 4 }}>
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                  Flagged Transactions by User
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={Object.values(
                      results.reduce((acc, r) => {
                        if (!acc[r.user_id]) acc[r.user_id] = { user_id: r.user_id, flagged: 0, total: 0 };
                        acc[r.user_id].total += 1;
                        if (r.flagged) acc[r.user_id].flagged += 1;
                        return acc;
                      }, {})
                    )}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <XAxis dataKey="user_id" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value, name) => [value, name === "flagged" ? "Flagged" : "Total"]} />
                    <Bar dataKey="flagged" name="Flagged" fill="#FF6B6B" />
                    <Bar dataKey="total" name="Total" fill="#4ECDC4" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>

          {/* Download Button */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleDownloadCSV}
              startIcon={<DownloadIcon />}
              sx={{ px: 4, py: 1.5, color: "#fff", borderColor: "#FF6B6B", "&:hover": { borderColor: "#FFD166" } }}
            >
              Download Detailed CSV
            </Button>
          </Box>

          {/* Generalized Summary */}
          <Box sx={{ mt: 4, mb: 2, textAlign: "center" }}>
            <Typography variant="subtitle1" sx={{ color: "#FFD166", fontWeight: 600 }}>
              {summary.flagged > 0
                ? `A total of ${summary.flagged} transactions were flagged as suspicious, representing ${summary.flaggedPercentage}% of all transactions.`
                : "No suspicious transactions were flagged in this analysis."}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "#4ECDC4", mt: 1 }}>
              {summary.avgRisk > 30
                ? "The average risk score is high, indicating potential fraud patterns among users."
                : "The overall risk score is within a safe range for most users."}
            </Typography>
          </Box>

          {/* Report Footer */}
          <Box
            sx={{
              bgcolor: "#232526",
              color: "#fff",
              p: 2,
              mt: 2,
              textAlign: "center",
              borderTop: "1px solid #333"
            }}
          >
            <Typography variant="body2" color="grey.400">
              &copy; {new Date().getFullYear()} Transaction Fraud Analyzer. All rights reserved.
            </Typography>
          </Box>
        </Paper>
      )}
    </Container>
  );
}