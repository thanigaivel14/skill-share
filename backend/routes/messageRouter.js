import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getInbox, getMessage, sendMessage } from "../controllers/messageController.js";
const router=express.Router();
router.post("/sendmessage",protect,sendMessage)
router.get("/inbox",protect,getInbox)
router.get("/getmessage/:id",protect,getMessage)


export default router;