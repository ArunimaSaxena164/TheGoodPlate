require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes=require("./routes/authRoutes.js");
const listingRoutes=require("./routes/ListingRoute.js");
const app = express();



connectDB();

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// routes
app.use("/api/auth",authRoutes);
app.use("/api/listings", listingRoutes);

// basic health route
app.get("/", (req, res) => res.send("TheGoodPlate API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
