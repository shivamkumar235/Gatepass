require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

async function addUser() {
  const username = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4];
  const role = process.argv[5];

  if (!username || !password || !name || !role) {
    console.log(
      'Use: node src/scripts/addUser.js <username> <password> "<Full Name>" <manager|dispatch|guard>',
    );
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const hashed = await bcrypt.hash(password, 10);

  try {
    await User.create({
      username: username,
      password: hashed,
      name: name,
      role: role,
    });
    console.log("User created: " + username + " (" + role + ")");
  } catch (err) {
    console.log("Error:", err.message);
  }

  await mongoose.disconnect();
}

addUser();
