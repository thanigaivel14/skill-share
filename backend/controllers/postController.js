import mongoose from "mongoose";
import Skillpost from "../model/skillPost.js";
import User from '../model/User.js';
import Notification from "../model/notifications.js";
import asynchandler from "express-async-handler"

const addpost = asynchandler(async (req, res) => {
    const { title, description, type, location } = req.body;

    // Validate required fields
    if (!title || !description || !type || !location) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }

    // Validate post type
    if (!["offer", "request"].includes(type)) {
        
        res.status(400);
        throw new Error("Post type must be either 'offer' or 'request'");
    }

    // Create the post
    const newpost = await Skillpost.create({
        title,
        description,
        type,
        location,
        user: req.user._id, // ✅ Use _id instead of id for consistency
    });

    // ✅ Create notifications if type is 'request'
    if (newpost.type === "request") {
        const nearbyUsers = await User.find({
            location: newpost.location,
            _id: { $ne: req.user._id }, // Exclude current user
        });
        if (nearbyUsers.length > 0) {
            const notifications = nearbyUsers.map((user) => ({
                userId: user._id,
                message: `${req.user.username} nearby needs help: "${newpost.title}"`,
            }));

            await Notification.insertMany(notifications);
        }
    }

    // Return the created post
    res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: newpost,
    });
});

//getallpost
const getallpost = asynchandler(async (req, res) => {
    try {
        const id=req.user.id;
        
        // Find all posts and populate user information (optional)
        const posts = await Skillpost.find({ user: { $ne: id } })
            .populate('user', 'username email') // Include if you want user details
            .sort({ createdAt: -1 }); // Newest first
        if (!posts || posts.length === 0) {
            res.status(200).json({
                success: true,
                message: "No posts found",
                data: []
            });
            return;
        }

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while fetching posts",
            error: error.message
        });
    }
});

//get single post
const getSinglePost = asynchandler(async (req, res) => {
    const { id } = req.params;

    // 1. Validate ObjectId format first
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
            success: false,
            message: "Invalid post ID format"
        });
        return;
    }

    // 2. Find the post
    const post = await Skillpost.findById(id).populate("user", "username email");

    // 3. Proper error handling for not found
    if (!post) {
        res.status(404).json({
            success: false,
            message: "Post not found"
        });
        return;
    }

    // 4. Successful response
    res.status(200).json({
        success: true,
        data: post
    });
});

//delete post
const deletePost = asynchandler(async (req, res) => {
    const { id } = req.params;
    try {

        const post = await Skillpost.findByIdAndDelete(id);
        res.status(200).json({ message: "post deleted.." })
    } catch (error) {
        res.status(404).json({ message: "post not found", error: error.message })
    }
})

//mark post as completed 
// PUT /api/posts/:id/complete
const markPostAsComplete = asynchandler(async (req, res) => {
    const { id } = req.params;

    const post = await Skillpost.findById(id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    // Ensure only owner can mark as complete
    if (post.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to mark this post");
    }

    post.status = 'completed';
    await post.save();

    res.status(200).json({ message: "Post marked as completed" });
});

//getPostByUser
const getPost = asynchandler(async (req, res) => {
    
    try {
        const id=req.user.id;
        // Find all posts and populate user information (optional)
        const posts = await Skillpost.find({ user: { $eq: id } })
             // Include if you want user details
            .sort({ createdAt: -1 }); // Newest first

        if (!posts || posts.length === 0) {
            res.status(200).json({
                success: true,
                message: "No posts found",
                data: []
            });
            return;
        }

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while fetching posts",
            error: error.message
        });
    }
});

export { addpost, getallpost, getSinglePost, deletePost, markPostAsComplete,getPost };