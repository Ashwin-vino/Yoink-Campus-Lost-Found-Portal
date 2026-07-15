const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const connectDB = require("./config/db");
const passport = require("./config/passport");

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");

const app = express();

console.log(process.env.MONGO_URI);

// Connect MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static Files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Make logged-in user available in all EJS files
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use("/", indexRoutes);
app.use("/auth", authRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Yoink! running on port ${PORT}`);
});