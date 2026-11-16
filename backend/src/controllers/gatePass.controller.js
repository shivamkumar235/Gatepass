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
    const { status } = req.body;
    if (!["Dispatched", "On Hold"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be Dispatched or On Hold" });
    }
    const update = { status };
    if (status === "Dispatched") update.exitTime = new Date(); // log exit time
    const pass = await GatePass.findOneAndUpdate(
      { passId: req.params.passId },
      update,
      { new: true },
    );
    if (!pass) return res.status(404).json({ message: "Pass not found" });
    res.json(pass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { gatPass, createGatePass, updateGatePass, findGatePass };
