import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;
const userSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    rollNo: {
        type: Number,
        required: true,
        trim: true
    },
    hostel: {
        type: String,
        required: true,
        trim: true
    },
    roomNo: {
        type: Number,
        required: true,
        trim: true
    },
    phoneNo: {
        type: Number,
        required: true,
        trim: true
    },
    bloodGroup: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: { type: Number, required: true, default:0 }
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
