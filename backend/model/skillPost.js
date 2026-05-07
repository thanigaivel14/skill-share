import mongoose from "mongoose";
const post=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["offer","request"],
        required:true
    },
    location:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status: {
  type: String,
  enum: ['active', 'completed'],
  default: 'active',
}

},{timestamps:true})

const Skillpost =mongoose.model("Skillpost",post)
export default Skillpost;