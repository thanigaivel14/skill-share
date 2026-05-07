import express from "express";
import { addpost,getallpost,getSinglePost ,deletePost,markPostAsComplete,getPost} from "../controllers/postController.js";
import {protect} from "../middleware/authMiddleware.js"
const router=express.Router();
router.post('/addpost',protect,addpost);
router.get('/allpost',protect,getallpost);
router.get('/singlepost/:id',protect,getSinglePost);
router.get('/singlepostByuser/',protect,getPost);

router.delete('/deletepost/:id',protect,deletePost);
router.put('/markascomplete/:id',protect,markPostAsComplete);




 export default router;
