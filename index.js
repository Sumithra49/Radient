require("dotenv").config(); // Load env first!

const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");

const redis = require("redis");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();
const DB_URL = process.env.DB_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Redis Client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  legacyMode: true, // Ensure compatibility with connect-redis
});

redisClient.connect().catch(console.error);

// Session Middleware
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // For development
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Session Example with Redis!");
});

// MongoDB Connection & Server Start
app.listen(5000, () => {
  connectDB(DB_URL);
  console.log("Server running on port 5000");
});
