require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// Routes
const authRoutes = require("./routes/authRoutes");
const ballotRoutes = require("./routes/ballotRoutes");
const voteRoutes = require("./routes/voteRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const resultRoutes = require("./routes/resultRoutes");
const voterRoutes = require("./routes/voterRoutes");

// Middleware
const rateLimiter = require("./middleware/rateLimiter");

const app = express();

// --------------------
// ✅ CORS (FIRST)
// --------------------
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ✅ Preflight support
app.options("*", cors());

// --------------------
// Middleware
// --------------------
app.use(express.json({ limit: "10mb" }));
app.use(rateLimiter);

// --------------------
// Static files
// --------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/ballots", ballotRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/voters", voterRoutes);

// --------------------
// ❗ 404 handler (PREVENTS CRASH)
// --------------------
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// --------------------
// ❗ Central error handler
// --------------------
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
});

// --------------------
// Server
// --------------------
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// --------------------
// MongoDB (STRICT SAFE MODE)
// --------------------
mongoose.set("strictQuery", true);

mongoose
    .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/voterdb", {
        serverSelectionTimeoutMS: 30000,
    })
    .then(() => {
        console.log("MongoDB connected");
        server.listen(PORT, () =>
            console.log(`Server running on port ${PORT}`)
        );
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });

// --------------------
// ❗ Process-level crash protection
// --------------------
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});
