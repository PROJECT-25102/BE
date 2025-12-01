export const socketConfig = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 20000,
  pingInterval: 25000,
  connectionStateRecovery: {},
};
