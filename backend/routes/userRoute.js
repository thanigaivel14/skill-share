import express from "express";
import { register,login, getMe ,updateProfile} from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js"
import { upload } from "../utils/cloudinary.js";

const router=express.Router();
router.post('/register',register)
router.post('/login',login)
router.get('/me',protect,getMe)
router.put('/update',protect,upload.single("avatar"),updateProfile);


router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out' });
});


export default router;