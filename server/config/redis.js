import Redis from "ioredis";

export const redis = new Redis({
  port: 10012,
  host: "redis-10012.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com",
  username: "default",
  password: process.env.REDIS_PW,
});
