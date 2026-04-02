const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, 'config', 'config.env') });

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const oauth = require('./routes/oauth');
const test = require('./routes/test');
const ai = require('./routes/ai');
const analytics = require('./routes/analytics');
const assessment = require('./routes/assessment');
const coding = require('./routes/coding');
const interview = require('./routes/interview');
const learning = require('./routes/learning');
const notification = require('./routes/notification');

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth', oauth);
app.use('/api/v1/test', test);
app.use('/api/v1/ai', ai);
app.use('/api/v1/analytics', analytics);
app.use('/api/v1/assessment', assessment);
app.use('/api/v1/coding', coding);
app.use('/api/v1/interview', interview);
app.use('/api/v1/learning', learning);
app.use('/api/v1/notifications', notification);

// Error handler middleware (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
