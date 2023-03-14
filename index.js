const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const booksRouter = require('./routes/books');
const reviewsRouter = require('./routes/reviews');
const userRouter = require('./routes/users');
require("dotenv").config();
const { createClient } = require('@supabase/supabase-js')

const app = express();

// Initialize Supabase instance
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {})

app.set("supabase", supabase)

app.use(
  cors({
    origin: [
      process.env.CLIENT_APP_URL,
    ],
    credentials: true,
  })
);

// Initialize CORS middleware for client app URL
app.use((req, res, next) => {
  const allowedOrigins = [
    process.env.CLIENT_APP_URL,
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", false);
  }
  res.header("Access-Control-Allow-Headers", true);
  res.header("Access-Control-Allow-Credentials", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add api routes
app.use('/api', booksRouter, reviewsRouter, userRouter);

// Connect to MongoDB database and start server
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const port = process.env.PORT || 8000;
    const dbHost = process.env.DB_HOST || localhost;

    app.listen(port, () => {
      console.log(`http://${dbHost}:${port}`);
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = app;
