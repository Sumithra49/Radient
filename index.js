require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const client = require("./config/redis");
const authRoutes = require("./routes/authRoutes"); // Import routes

const app = express();
const DB_URL = process.env.DB_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Middlewares
app.use(express.json()); // Important for parsing JSON!
app.use(
  session({
    store: new RedisStore({ client }),
    secret: SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Use Auth Routes
app.use("/auth", authRoutes);

// Test Route (Optional)
app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  res.send(`Number of views: ${req.session.views}`);
});

// MongoDB Connection & Start
app.listen(5000, () => {
  connectDB(DB_URL);
  console.log("Server running on port 5000");
});
