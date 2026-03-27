require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const compression = require("compression");
require("./events/voteListeners");

// Routes
const authRoutes = require("./routes/authRoutes");
const ballotRoutes = require("./routes/ballotRoutes");
const voteRoutes = require("./routes/voteRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const resultRoutes = require("./routes/resultRoutes");
const voterRoutes = require("./routes/voterRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Middleware
const rateLimiter = require("./middleware/rateLimiter");

const app = express();

/* =====================================================
   ✅ CORS — supports both local dev and production
===================================================== */
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            callback(new Error(`CORS blocked: ${origin}`));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Preflight
app.options("*", cors());

/* =====================================================
   Middleware — order matters
===================================================== */
app.use(compression()); // gzip all responses
app.use(express.json({ limit: "10mb" }));
app.use(mongoSanitize()); // prevent NoSQL injection ($, . in keys)
app.use(hpp()); // prevent HTTP parameter pollution
app.use(rateLimiter);

// Trust proxy for accurate IP logging behind Nginx/load balancer
app.set("trust proxy", 1);

/* =====================================================
   Static files
===================================================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =====================================================
   Health check (useful for uptime monitors)
===================================================== */
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

/* =====================================================
   API Routes
===================================================== */
app.use("/api/auth", authRoutes);
app.use("/api/ballots", ballotRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/ai", aiRoutes);

/* =====================================================
   404 Handler
===================================================== */
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

/* =====================================================
   Global Error Handler
===================================================== */
app.use((err, req, res, next) => {
    // CORS errors
    if (err.message?.startsWith("CORS blocked")) {
        return res.status(403).json({ message: err.message });
    }
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
        message:
            process.env.NODE_ENV === "production"
                ? "Internal server error"
                : err.message || "Internal server error",
    });
});

/* =====================================================
   Server
===================================================== */
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("🔌 User disconnected:", socket.id);
    });
});

/* =====================================================
   MongoDB
===================================================== */
mongoose.set("strictQuery", true);

const MONGO_URI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/voterdb";

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        server.listen(PORT, () => {
            console.log(`🚀 Backend running at http://localhost:${PORT}`);
            console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });

/* =====================================================
   Process-level protection
===================================================== */
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

module.exports = { app, server };
