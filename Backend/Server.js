import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import cors from 'cors'
import dns from "dns";
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
    console.warn("Custom DNS servers setup skipped:", error.message);
}
import { connectDB } from './Config/db.js';
import foodModel from './Models/foodModel.js';
import foodRouter from './Routes/foodRoute.js';
import userRouter from './Routes/userRoute.js';
import cartRouter from './Routes/cartRoute.js';
import orderRouter from './Routes/orderRoute.js';
import supportRouter from './Routes/supportRoute.js';
import promoRouter from './Routes/promoRoute.js';
import reviewRouter from './Routes/reviewRoute.js';
import analyticsRouter from './Routes/analyticsRoute.js';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const port = 4000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Expose io to routes by attaching it to req
app.use((req, res, next) => {
    req.io = io;
    next();
});

//middleware
app.use(express.json());
app.use(cors())

//db connection
connectDB();

//api endpoint
app.use("/api/food",foodRouter);
app.use("/images", express.static('Uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order",orderRouter);
app.use("/api/support", supportRouter);
app.use("/api/promo", promoRouter);
app.use("/api/review", reviewRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/",(req,res) => {
    res.send("api working")
})

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // User can join a room based on their userId to receive specific updates
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their personal room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})
//mongodb+srv://muskangupta5465:muskangupta2006@cluster0.axhpwvg.mongodb.net/?appName=Cluster0