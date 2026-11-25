const express = require("express");
const router = express.Router();
const gatePass = require("../controllers/gatePass.controller");
const { verifyToken, allowRoles } = require("../middleware/auth.middleware");

// Har route par pehle verifyToken (login?), phir allowRoles (role sahi?)
router.get(
  "/",
  verifyToken,
  allowRoles(["manager", "guard"]),
  gatePass.gatPass,
);
router.post(
  "/",
  verifyToken,
  allowRoles(["manager", "dispatch"]),
  gatePass.createGatePass,
);
router.get(
  "/:passId",
  verifyToken,
  allowRoles(["manager", "guard"]),
  gatePass.findGatePass,
);
router.put(
  "/:passId",
  verifyToken,
  allowRoles(["manager", "guard"]),
  gatePass.updateGatePass,
);

module.exports = router;
