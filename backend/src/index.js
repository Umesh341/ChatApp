import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoute from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url"; // ✅ for ESM
import axios from "axios";


// const url = `https://chatapp-6euq.onrender.com/`;
// const interval = 600000;

// function reloadWebsite() {
//   axios
//     .get(url)
//     .then((response) => {
//       console.log("website reloded");
//     })
//     .catch((error) => {
//       console.error(`Error : ${error.message}`);
//     });
// }

// setInterval(reloadWebsite, interval);








// Load environment variables
dotenv.config();

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const PORT = process.env.PORT || 5000;





// ✅ Proper __dirname handling for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

// ✅ Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  // Path to built React files (frontend/dist)
  const frontendPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(frontendPath));

  // Serve index.html for all non-API routes
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB();
});
