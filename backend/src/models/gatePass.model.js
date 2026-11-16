const mongoose = require("mongoose");

const gatePassSchema = new mongoose.Schema({
  passId: { type: String, unique: true }, // e.g. GP-1001
  truckNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  driverPhone: { type: String, required: true },
  transporter: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  destination: { type: String, required: true },
  materialDescription: { type: String, required: true },
  totalBoxes: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Ready for Exit", "Dispatched", "On Hold"],
    default: "Ready for Exit",
  },
  exitTime: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

const GatePass = mongoose.model("pass", gatePassSchema);

module.exports = GatePass;
