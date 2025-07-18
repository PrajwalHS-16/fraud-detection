import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Avatar, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShieldIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import InsightsIcon from '@mui/icons-material/Insights';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#181A20', color: '#fff', overflowX: 'hidden' }}>
      {/* Hero section */}
      <Box
        sx={{
          height: '60vh',
          background: 'linear-gradient(120deg, #232526 0%, #ff1744 100%)',
          backgroundSize: '400% 400%',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 2,
          position: 'relative',
        }}
      >
        {/* Security SVG background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.08,
            backgroundImage: 'url("https://www.svgrepo.com/show/354380/shield-security.svg")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '60%',
            zIndex: 0,
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ zIndex: 1 }}
        >
          <Avatar sx={{ bgcolor: '#232526', mx: 'auto', mb: 2, width: 64, height: 64 }}>
            <ShieldIcon sx={{ color: '#ff1744', fontSize: 48 }} />
          </Avatar>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, letterSpacing: 1 }}>
            Fraud Detection Dashboard
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Real-time alerts, explainable rules, and secure monitoring.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="error"
            sx={{ px: 4, py: 1.5, fontSize: '1.2rem', borderRadius: '999px', textTransform: 'none', boxShadow: 2 }}
            onClick={() => navigate('/analyze')}
          >
            Start Analysis
          </Button>
        </motion.div>
      </Box>

      {/* Features - stacked cards */}
      <Container sx={{ py: 6 }}>
        <Grid container direction="column" spacing={4} alignItems="center">
          {[
            { icon: <WarningIcon color="error" fontSize="large" />, title: "Instant Alerts", desc: "Get notified of suspicious transactions as they happen." },
            { icon: <InsightsIcon color="primary" fontSize="large" />, title: "Explainable Rules", desc: "Every detection is based on transparent logic." },
            { icon: <ShieldIcon color="success" fontSize="large" />, title: "Secure & Auditable", desc: "Ideal for compliance, audits, and risk monitoring." },
          ].map((feature, i) => (
            <Grid item xs={12} md={8} key={i} sx={{ width: '100%' }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <Paper elevation={4} sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  bgcolor: '#232526',
                  color: '#fff',
                  boxShadow: '0 4px 24px 0 rgba(255,23,68,0.15)'
                }}>
                  <Avatar sx={{ bgcolor: '#181A20', mx: 'auto', mb: 2 }}>{feature.icon}</Avatar>
                  <Typography variant="h6" sx={{ mb: 1 }}>{feature.title}</Typography>
                  <Typography variant="body2" color="grey.400">{feature.desc}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Explanation section */}
      <Box sx={{ bgcolor: '#232526', py: 6 }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              Why choose rule‑based fraud detection?
            </Typography>
            <Typography variant="body1" align="center" color="grey.400">
              Rule-based systems are fast, lightweight and completely transparent.
              Unlike black-box machine learning models, every alert here is explainable — making it ideal
              for audits, compliance, and real-time risk monitoring.
            </Typography>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}