const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const gatePassRoutes = require("./routes/gatePass.route");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use("/api/auth", authRoutes); // login
app.use("/api/passes", gatePassRoutes); // gate passes (login zaroori)

module.exports = app;
