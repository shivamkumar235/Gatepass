const mongoose = require("mongoose");
const GatePass = require("../models/gatePass.model");

// Sample data (sirf jab database khali ho)
async function seedData() {
  const count = await GatePass.countDocuments();
  if (count > 0) return;
  await GatePass.insertMany([
    {
      passId: "GP-1001",
      truckNumber: "UP16 AB 1234",
      driverName: "Ramesh Kumar",
      driverPhone: "9876543210",
      transporter: "Shree Balaji Transport",
      invoiceNumber: "INV-2024-001",
      destination: "Delhi",
      materialDescription: "Electronic Goods",
      totalBoxes: 120,
      status: "Ready for Exit",
    },
    {
      passId: "GP-1002",
      truckNumber: "HR55 CD 5678",
      driverName: "Sunil Yadav",
      driverPhone: "9812345678",
      transporter: "Gupta Logistics",
      invoiceNumber: "INV-2024-002",
      destination: "Jaipur",
      materialDescription: "Garments",
      totalBoxes: 250,
      status: "Dispatched",
      exitTime: new Date(),
    },
    {
      passId: "GP-1003",
      truckNumber: "DL1C 9087",
      driverName: "Imran Khan",
      driverPhone: "9899001122",
      transporter: "Rapid Cargo",
      invoiceNumber: "INV-2024-003",
      destination: "Lucknow",
      materialDescription: "FMCG Products",
      totalBoxes: 400,
      status: "On Hold",
    },
    {
      passId: "GP-1004",
      truckNumber: "UP14 EF 4455",
      driverName: "Vikas Sharma",
      driverPhone: "9917112233",
      transporter: "Sharma Roadways",
      invoiceNumber: "INV-2024-004",
      destination: "Chandigarh",
      materialDescription: "Home Appliances",
      totalBoxes: 75,
      status: "Ready for Exit",
    },
  ]);
  console.log("Sample data added");
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    await seedData();
  } catch (err) {
    console.log("Database connection error:", err.message);
  }
}

module.exports = connectDB;
