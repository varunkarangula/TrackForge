const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/categories', require('./routes/categoryRoutes.js'));
app.use('/api/accounts', require('./routes/accountRoutes.js'));
app.use('/api/transactions', require('./routes/transactionRoutes.js'));
app.use('/api/budgets', require('./routes/budgetRoutes.js'));
app.use('/api/tasks', require('./routes/taskRoutes.js'));
app.use('/api/events', require('./routes/eventRoutes.js'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes.js'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
