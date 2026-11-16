const express = require("express"); // yeh line missing thi
const cors = require("cors");
const gatePassRoutes = require("./routes/gatePass.route");

const app = express();

app.use(cors());
app.use(express.json()); // read JSON from request body

app.use("/api/passes", gatePassRoutes);

module.exports = app;
