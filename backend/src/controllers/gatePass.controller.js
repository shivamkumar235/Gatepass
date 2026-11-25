const GatePass = require("../models/gatePass.model");

async function generatePassId() {
  // Get all existing pass IDs (only the passId field)
  const all = await GatePass.find({}, "passId");

  // Find the biggest number among them (GP-1004 -> 1004)
  let maxNumber = 1000;
  all.forEach((p) => {
    const num = parseInt(p.passId.split("-")[1]);
    if (num > maxNumber) maxNumber = num;
  });

  return "GP-" + (maxNumber + 1); // next one
}

async function gatPass(req, res) {
  try {
    const passes = await GatePass.find().sort({ createdAt: -1 });
    res.json(passes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createGatePass(req, res) {
  try {
    const passId = await generatePassId();
    const pass = await GatePass.create({ ...req.body, passId });
    res.status(201).json(pass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function findGatePass(req, res) {
  try {
    const pass = await GatePass.findOne({ passId: req.params.passId });
    if (!pass) return res.status(404).json({ message: "Pass not found" });
    res.json(pass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateGatePass(req, res) {
  try {
    // 1. Frontend ne jo status bheja woh nikalo
    const status = req.body.status;

    // 2. Sirf yehi do status allow hain
    if (status !== "Dispatched" && status !== "On Hold") {
      res.status(400);
      res.json({ message: "Status must be Dispatched or On Hold" });
      return;
    }

    // 3. Update ka object banao
    const update = {};
    update.status = status;

    // 4. Dispatched hai toh abhi ka time exitTime mein daalo
    if (status === "Dispatched") {
      update.exitTime = new Date();
    }

    // 5. Database mein pass dhoondho aur update karo
    const pass = await GatePass.findOneAndUpdate(
      { passId: req.params.passId }, // kise dhoondho
      update, // kya badlo
      { new: true }, // badla hua data wapas do
    );

    // 6. Pass mila hi nahi
    if (!pass) {
      res.status(404);
      res.json({ message: "Pass not found" });
      return;
    }

    // 7. Sab theek, updated pass wapas bhejo
    res.json(pass);
  } catch (err) {
    res.status(500);
    res.json({ message: err.message });
  }
}

module.exports = { gatPass, createGatePass, updateGatePass, findGatePass };
