import dotenv from 'dotenv';
dotenv.config();
import http from "http";
import app from "./app";
import redisClient, { connectRedis } from "./config/redis";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectRedis(); // ✅ THIS is what you call

  // TEMP test (remove later)
  await redisClient.set("health", "ok");
  console.log(await redisClient.get("health"));

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
