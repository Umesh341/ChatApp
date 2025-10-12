import express from 'express';
import authRoutes from "./routes/auth.route.js"; 
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import messageRoute from './routes/message.route.js';
import cors from 'cors';
import { app, server} from './lib/socket.js';
import path from "path";


dotenv.config();
app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


// CORS configuration
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials:true,
        methods: ['GET','POST','PUT','DELETE'],
    }
));

const PORT = process.env.PORT ;
const __dirname = "/opt/render/project/src/backend/frontend/dist"


if(process.env.NODE_ENV === "production"){
     const frontendPath = path.join(__dirname, "../../frontend/dist"); // ✅ corrected
  app.use(express.static(frontendPath));
    app.get(/(.*)/ , (req,res)=>{
        res.sendFile(path.join(__dirname,"frontend", "dist" , "index.html"));
    })
}

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

server.listen(PORT,()=>{
    console.log(`Server is running on port:gy ${PORT}`);
    connectDB();
});