import mongoose from "mongoose";
import { throwError } from "../../common/utils/create-response.js";
import { queryHelper } from "../../common/utils/query-helper.js";
import Seat from "../seat/seat.model.js";
import Room from "./room.model.js";

export const getSeatByRoomService = async (roomId) => {
  const room = await Room.findById(roomId);
  if (!room) throwError(400, "Không tìm thấy phòng chiếu!");
  const seats = await Seat.find({ roomId: room._id });
  return { ...room.toObject(), seats };
};

export const getAllRoomService = async (query) => {
  const data = await queryHelper(Room, query);
  return data;
};

export const getDetailRoomService = async (id) => {
  const data = await Room.findById(id);
  return data;
};

export const createRoomService = async (payload) => {
  const existed = await Room.findOne({
    name: { $regex: `^${payload.name}$`, $options: "i" },
  });
  if (existed) throwError(400, "Phòng chiếu này đã tồn tại trong hệ thống!");
  const room = await Room.create({ ...payload });
  const seatsWithId = payload.seats.map((item) => ({
    ...item,
    roomId: room._id,
  }));
  const seats = await Seat.insertMany(seatsWithId);
  await room.save();
  return { ...room.toObject(), seats };
};

export const updateRoomService = async (id, payload) => {
  const { seats, ...rest } = payload;
  const existed = await Room.findOne({
    _id: { $ne: id },
    name: { $regex: `^${payload.name}$`, $options: "i" },
  });
  if (existed) throwError(400, "Phòng chiếu này đã tồn tại trong hệ thống");
  const updatedRoom = await Room.findByIdAndUpdate(id, rest, { new: true });
  if (!updatedRoom) throwError(400, "Phòng không tồn tại");
  if (seats && seats.length > 0) {
    const existingSeats = await Seat.find({ roomId: id });
    const bulkOps = seats
      .map((seat) => {
        const exist = existingSeats.find((s) => s._id.toString() === seat._id);
        if (!exist) return null;
        if (exist.status !== seat.status || exist.type !== seat.type) {
          return {
            updateOne: {
              filter: { _id: seat._id, roomId: id },
              update: {
                $set: {
                  status: seat.status,
                  type: seat.type,
                },
              },
            },
          };
        }
        return null;
      })
      .filter(Boolean);
    if (bulkOps.length > 0) {
      await Seat.bulkWrite(bulkOps);
    }
  }
  return updatedRoom;
};

export const updateRoomStatusService = async (id) => {
  const findRoom = await Room.findById(id);
  if (!findRoom) throwError(400, "Phòng chiếu không tồn tại");
  findRoom.status = !findRoom.status;
  const updated = await findRoom.save();
  return {
    data: updated,
    message: updated.status
      ? "Kích hoạt phòng thành công. Các xuất chiếu sẽ hoạt động trở lại"
      : "Khoá phòng thành công. Các xuất chiếu sẽ bị tạm ngưng!",
  };
};
