import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (Railway uses this to verify the service is alive)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');

  // Serve static assets (JS, CSS, images)
  app.use(express.static(distPath));

  // All non-API routes serve the React SPA
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Team Task Manager API is running...');
  });
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
