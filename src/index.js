import dns from "dns";
// Set custom DNS servers to avoid potential DNS resolution issues
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv/config";
import connectDB from "./config/db.js";
import app from "./app.js";   

const PORT = process.env.PORT || 5000;

// Connect to the database and start the server
connectDB()
.then(() => {
   app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on https ${process.env.PORT || 5000}`);
   })
})
.catch((err) => {
   console.error("Failed to connect to the database:", err);
   process.exit(1);
});