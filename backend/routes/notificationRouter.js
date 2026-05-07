import express from "express";
import {protect} from "../middleware/authMiddleware.js"
import { deleteNotification, getNotification, markAsSeen } from "../controllers/notificationController.js";

const router=express.Router();
router.get('/',protect,getNotification)
router.put('/:id',protect,markAsSeen)
router.delete('/:id',protect,deleteNotification)


export default router;