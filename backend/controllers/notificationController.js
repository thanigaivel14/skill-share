import asynchandler from "express-async-handler";
import Notification from "../model/notifications.js";

const getNotification= asynchandler(async(req,res)=>{
    const id=req.user._id;
     const notifications=await Notification.find({userId:id,seen:false}).populate("userId","username");
     
     if(notifications.length === 0){
       return res.status(200).json({message:"no notifications available."})
     }
     res.status(200).json({notifications})

})

//mark as seen 
const markAsSeen = asynchandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  // Make sure the notification belongs to the current user
  if (notification.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this notification");
  }

  notification.seen = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: "Notification marked as seen",
    data: notification,
  });
});

//delete notificaions


const deleteNotification = asynchandler(async (req, res) => {
  const { id } = req.params;
 
  const notification = await Notification.findById(id);

  // 1. Check if it exists
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  // 2. Ensure it belongs to the logged-in user
  if (notification.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this notification");
  }

  // 3. Delete it
  await notification.deleteOne();

  res.status(200).json({ message: "Notification deleted successfully" });
});


export {getNotification,markAsSeen,deleteNotification}