require("dotenv").config(); // sabse upar, kuch bhi require karne se pehle

const app = require("./src/app");
const connectDB = require("./src/db/db");
connectDB();
app.listen(5000, () => {
  console.log("server is running on port num 3000");
});
