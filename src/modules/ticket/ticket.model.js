import mongoose from "mongoose";
import { TICKET_STATUS } from "../../common/constants/ticket.js";
import crypto from "crypto";

const ticketItems = new mongoose.Schema(
  {
    seatId: {
      type: String,
      required: true,
    },
    seatLabel: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
    _id: false,
  },
);

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },
    status: {
      type: String,
      enum: [...Object.values(TICKET_STATUS)],
      default: TICKET_STATUS.PENDING,
    },
    usedTime: {
      type: String,
      required: function () {
        return this.status === TICKET_STATUS.CONFIRMED;
      },
    },
    customerInfo: {
      type: {
        email: {
          type: String,
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
      },
    },
    movieId: {
      type: String,
      required: true,
    },
    movieName: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    roomName: {
      type: String,
      required: true,
    },
    items: [ticketItems],
    startTime: {
      type: String,
      required: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    cancelDescription: {
      type: String,
      required: function () {
        return this.status === TICKET_STATUS.CANCELLED;
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ticketSchema.pre("save", async function (next) {
  if (this.ticketId) return next();
  const generateId = () => {
    const time = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(2).toString("hex").toUpperCase();
    return `BEE-${time}${random}`;
  };
  while (true) {
    const id = generateId();
    const exists = await this.constructor.exists({ ticketId: id });
    if (!exists) {
      this.ticketId = id;
      break;
    }
  }
  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
