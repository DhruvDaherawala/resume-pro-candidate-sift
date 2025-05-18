
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { jobOpeningRoutes } = require('./routes/jobOpenings');
const { candidateRoutes } = require('./routes/candidates');
const { dashboardRoutes } = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://dhruvkhatri460:D88v0s6TUy1uKXoL@ai-hr-cluster.huc2t6h.mongodb.net/hr_management";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/jobs', jobOpeningRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

