import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';

const TransactionTable = ({ results }) => {
  return (
    <Box sx={{ maxHeight: '500px', overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>User ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Amount (₹)</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Risk Score</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Reasons</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((r, i) => (
            <TableRow key={i} sx={{ 
              bgcolor: r.flagged ? '#FFF9F9' : 'inherit',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}>
              <TableCell>{r.user_id}</TableCell>
              <TableCell>{Number(r.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
              <TableCell>
                <Box sx={{ 
                  display: 'inline-block', 
                  px: 1, 
                  borderRadius: 1,
                  bgcolor: r.flagged ? '#FFEBEE' : '#E8F5E9',
                  color: r.flagged ? '#C62828' : '#2E7D32'
                }}>
                  {r.flagged ? "FLAGGED" : "Clear"}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ 
                  display: 'inline-block', 
                  px: 1, 
                  borderRadius: 1,
                  bgcolor: r.risk_score >= 30 ? '#FFEBEE' : 
                           r.risk_score >= 15 ? '#FFF8E1' : '#E8F5E9',
                  color: r.risk_score >= 30 ? '#C62828' : 
                         r.risk_score >= 15 ? '#F57F17' : '#2E7D32'
                }}>
                  {r.risk_score}
                </Box>
              </TableCell>
              <TableCell>{r.reasons}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TransactionTable;