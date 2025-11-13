import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    capacity: {
      type: Number,
      default: 120,
    },
    cols: Number,
    rows: Number,
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
