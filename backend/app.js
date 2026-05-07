import express from "express"
import connect from"./config/db.js"
import dotenv from "dotenv"
import userRoute from "./routes/userRoute.js"
import cookieParser from 'cookie-parser';
import cors from 'cors'
import postRouter from "./routes/postRouter.js"
import notificationRouter from "./routes/notificationRouter.js"
import messageRouter from "./routes/messageRouter.js"
import path from"path"
dotenv.config(); 
const app=express();
app.use(express.json())

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true                // allow sending cookies
}));

connect();
// userRouters
app.use('/api/user/',userRoute)
app.use('/api/posts/',postRouter)
app.use('/api/notifications/',notificationRouter)
app.use('/api/message/',messageRouter)
export default app;
