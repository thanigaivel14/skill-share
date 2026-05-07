import mongoose from "mongoose";
import { Schema } from "mongoose";
const userSchema= new Schema({
    username:{
        type:"String",
        required:true
    },
    email:{
        type:"String",
        required: true,
        unique:"true"
    },
    password:{
         type:"String",
        required:true
    },
    location:{
        type:"String",
        required:true
    },
    avatar:{
        type:"String",
    },
    avatarPublicId: { type: String },
})
const User = mongoose.model('User', userSchema);
export default User;