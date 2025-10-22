import express from 'express';
import config from './src/config/app.js';
import stringRoutes from './src/routes/stringRoutes.js';

const app = express();
app.use(express.json());

// Routes
app.use('/', stringRoutes);

app.listen(config.port, () => {
  console.log(`String Analysis API running on port ${config.port}`);
});