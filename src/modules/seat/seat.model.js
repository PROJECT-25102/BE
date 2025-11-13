import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    col: {
      type: Number,
      required: true,
    },
    row: {
      type: Number,
      required: true,
    },
    span: {
      type: Number,
      default: 1,
    },
    type: {
      type: String,
      enum: ["NORMAL", "VIP", "COUPLE"],
      default: "NORMAL",
    },
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

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;
