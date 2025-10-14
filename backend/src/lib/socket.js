import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials:true
    },
});
//

export function getReceiverSocketId(userId){
    console.log(userSocketMap)
    return userSocketMap[userId];
}

const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    const userId = socket.handshake.auth;

    console.log(userId)
  
    if (userId){ userSocketMap[userId.userId] = socket.id; console.log(userSocketMap) }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("a user disconnected", socket.id)
        delete userSocketMap[userId.userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

    })
})

export { io, app, server }