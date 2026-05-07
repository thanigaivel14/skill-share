import asyncHandler from "express-async-handler";
import Message from "../model/Message.js";
import User from "../model/User.js";
import Skillpost from "../model/skillPost.js";

const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id;  // authenticated user
  
  const { receiverId, content, postId } = req.body;


  // 1. Validate required fields
  if (!receiverId || !content) {
    res.status(400);
    throw new Error("receiverId and content are required.");
  }

  // 2. Optional: Prevent messaging yourself
  if (receiverId === senderId.toString()) {
    res.status(400).json({message:"you can not message yourself"});
    throw new Error("You cannot message yourself.");
  }

  // 3. Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    res.status(404);
    throw new Error("Receiver not found.");
  }

  // 4. (Optional) Validate postId if provided
  if (postId) {
    const postExists = await Skillpost.findById(postId);
    if (!postExists) {
      res.status(404);
      throw new Error("Related post not found.");
    }
  }

  // 5. Create and save message
  const newMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    post: postId || null,
    content,
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
     newMessage,
  });
});

//inbox
const getInbox = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Fetch all messages involving this user
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .sort({ updatedAt: -1 }) // Newest messages first
    .populate("sender", "username email avatar")
    .populate("receiver", "username email avatar");

  // 2. Create a map to store unique conversations
  const conversationMap = new Map();
  messages.forEach((msg) => {
    const partner =
      msg.sender._id.toString() === userId.toString()
        ? msg.receiver
        : msg.sender;


    const key = partner._id.toString();

    if (!conversationMap.has(key)) {
      conversationMap.set(key, {
        partnerId: partner._id,
        partnerName: partner.username,
        partnerEmail: partner.email,
        partnerAvatar:partner?.avatar || '',
        lastMessage: msg.content,
        seen: msg.sender._id.toString() !== userId.toString() ? msg.seen : true,
        timestamp: msg.updatedAt,
      });
    }
  });

  const inbox = Array.from(conversationMap.values());

  res.status(200).json({
    success: true,
    count: inbox.length,
    inbox,
  });
});

//get  conversation
const getMessage = asyncHandler(async (req, res) => {
  const partnerId = req.params.id;
  const userId = req.user._id;

  // 1. Fetch all messages between the two users
  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: partnerId },
      { sender: partnerId, receiver: userId },
    ],
  })
    .sort({ createdAt: 1 }) // Oldest to newest
    .populate("sender", "username email avatar")
    .populate("receiver", "username email avatar");

  // 2. Mark all unseen messages from partner as seen
  await Message.updateMany(
    {
      sender: partnerId,
      receiver: userId,
      seen: false,
    },
    { $set: { seen: true } }
  );

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages,
  });
});
export { sendMessage,getInbox,getMessage};
