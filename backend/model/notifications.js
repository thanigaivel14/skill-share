import mongoose from "mongoose";
 const notificationSchema= mongoose.Schema({
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    require:true
},
message:{
    type:String,
    require:true
},
seen:{
    type:Boolean,
    default: false,
},
createdAt: {
    type: Date,
    default: Date.now,
  },
 })
 const Notification = mongoose.model('Notification', notificationSchema);
 export default Notification;