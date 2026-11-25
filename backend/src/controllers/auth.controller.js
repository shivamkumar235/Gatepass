const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function login(req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    // Dono text hone chahiye
    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400);
      res.json({ message: "Username and password are required" });
      return;
    }

    // User dhoondho
    const user = await User.findOne({
      username: username.toLowerCase().trim(),
    });

    // User nahi mila ya band hai
    if (!user || !user.isActive) {
      res.status(401);
      res.json({ message: "Wrong username or password" });
      return;
    }

    // Password match karo (hash se)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      res.json({ message: "Wrong username or password" });
      return;
    }

    // Token banao (12 ghante chalega)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );

    res.json({ token: token, user: { name: user.name, role: user.role } });
  } catch (err) {
    res.status(500);
    res.json({ message: err.message });
  }
}

module.exports = { login };
