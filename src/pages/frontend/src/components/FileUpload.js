import React from 'react';
import { Box, Button, Input, FormControl, InputLabel, Typography } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

const FileUpload = ({ file, fileName, onFileChange, onUpload, loading, error }) => {
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="file-upload" shrink>Upload CSV File</InputLabel>
      <Input id="file-upload" type="file" accept=".csv" sx={{ display: 'none' }} onChange={onFileChange} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button variant="outlined" component="label" startIcon={<UploadIcon />} sx={{ mr: 2 }}>
          Choose File
          <input type="file" accept=".csv" hidden onChange={onFileChange} />
        </Button>
        <Typography variant="body1">{fileName || "No file chosen"}</Typography>
      </Box>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      <Button variant="contained" color="primary" onClick={onUpload} disabled={loading || !file} startIcon={<UploadIcon />} sx={{ mt: 2, px: 4, py: 1.5 }}>
        {loading ? 'Analyzing...' : 'Analyze Transactions'}
      </Button>
    </FormControl>
  );
};

export default FileUpload;