import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const SummaryCards = ({ summary }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">Total Transactions</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{summary.total}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">Flagged Transactions</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF6B6B' }}>{summary.flagged}</Typography>
            <Typography variant="body2">({summary.flaggedPercentage}% of total)</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">Total Amount</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>₹{summary.totalAmount}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">Avg. Risk Score</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{summary.avgRisk}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;