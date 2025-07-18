import React from 'react';
import { Box, Typography } from '@mui/material';

const ReportFooter = () => {
  return (
    <Box sx={{ 
      bgcolor: '#f5f5f5', 
      p: 2, 
      mt: 4,
      textAlign: 'center',
      borderTop: '1px solid #e0e0e0'
    }}>
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Fraud Detection System | Confidential Report
      </Typography>
    </Box>
  );
};

export default ReportFooter;