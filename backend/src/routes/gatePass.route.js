const express = require("express");
// const jwt = require("jsonwebtoken");
// const authMiddleware = require("../middlewares/auth.middleware");
const gatePass = require("../controllers/gatePass.controller");
const router = express.Router();

router.get("/", gatePass.gatPass); // GET  /api/passes
router.post("/", gatePass.createGatePass); // POST /api/passes
router.get("/:passId", gatePass.findGatePass); // GET  /api/passes/GP-1001
router.put("/:passId", gatePass.updateGatePass);

module.exports = router;
