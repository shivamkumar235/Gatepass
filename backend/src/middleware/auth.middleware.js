const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Darwaza 1: login hai ya nahi
async function verifyToken(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      res.status(401);
      res.json({ message: "Please login first" });
      return;
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Database se dekho user abhi bhi allowed hai ya nahi
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      res.status(401);
      res.json({ message: "Account not allowed" });
      return;
    }

    req.user = user;
    next(); // aage badho
  } catch (err) {
    res.status(401);
    res.json({ message: "Session expired, please login again" });
  }
}

// Darwaza 2: role allowed hai ya nahi
function allowRoles(roles) {
  return function (req, res, next) {
    if (roles.includes(req.user.role)) {
      next();
      return;
    }
    res.status(403);
    res.json({ message: "You do not have permission" });
  };
}

module.exports = { verifyToken, allowRoles };
