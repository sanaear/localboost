import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379
});

redis.on("connect", () => {
  return "Redis connected";
  // console.log("Redis connected");
});
export default redis;