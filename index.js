import cors from "cors";
import express from "express";
import http from "http";
import morgan from "morgan";
import connectDB from "./src/common/configs/database.js";
import { NODE_ENV, PORT } from "./src/common/configs/environment.js";
import { checkVersion } from "./src/common/configs/node-version.js";
import errorHandler from "./src/common/middlewares/error.middleware.js";
import jsonValidator from "./src/common/middlewares/json-valid.middleware.js";
import notFoundHandler from "./src/common/middlewares/not-found.middleware.js";
import { seatStatusJob } from "./src/modules/job/seatStatusJob.js";
import { movieStatusJob } from "./src/modules/job/statusMovieJob.js";
import { showtimeStatusJob } from "./src/modules/job/statusShowtimeJob.js";
import { initSocket } from "./src/modules/socket/index.js";
import routes from "./src/routes.js";
checkVersion();

const app = express();

app.use(express.json());
app.use(cors());

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (_, res) => res.json("hello world"));
app.use("/api", routes);

app.use(jsonValidator);
app.use(notFoundHandler);
app.use(errorHandler);

let server;

connectDB()
  .then(() => {
    console.log("✓ Connected to MongoDB");
    server = http.createServer(app);
    initSocket(server);
    movieStatusJob();
    showtimeStatusJob();
    seatStatusJob();
    server.listen(PORT, async () => {
      if (NODE_ENV === "development") {
        console.log(`• API: http://localhost:${PORT}`);
      }
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err);
    process.exit(1);
  });

process.on("unhandledRejection", (error) => {
  console.error(`Error: ${error.message}`);
  if (server) {
    server.close();
  } else {
    process.exit(1);
  }
});
