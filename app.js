const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const connectDB = require("./config/db");
const passport = require("./config/passport");

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 5000;
const sessionSecret = process.env.SESSION_SECRET || "change-me-in-production";

connectDB().catch((error) => {
    console.error("MongoDB connection failed during startup:", error.message);
});

// Middleware
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionStore = process.env.MONGO_URI
    ? MongoStore.create({
          mongoUrl: process.env.MONGO_URI,
          collectionName: "sessions",
          ttl: 14 * 24 * 60 * 60
      })
    : undefined;

// Session
app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
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

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Yoink! running on port ${PORT}`);
    });
}

module.exports = app;