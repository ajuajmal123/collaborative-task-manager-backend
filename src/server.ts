import { env } from "./config/env";
import http from "http";
import app from "./app";
import { connectDB } from "./config/db";

import { initSocket } from "./config/socket";

connectDB();

const server = http.createServer(app);

initSocket(server);

server.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
