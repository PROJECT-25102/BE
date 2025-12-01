export default (socket, io) => {
  socket.on("joinShowtime", (showtimeId) => {
    socket.join(showtimeId);
    console.log(`${socket.id} joined ${showtimeId}`);
  });
  socket.on("leaveShowtime", (showtimeId) => {
    console.log(`${socket.id} leave ${showtimeId}`);
    socket.leave(showtimeId);
  });
};
