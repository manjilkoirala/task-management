import { createClient } from 'redis';

const redisClient = createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  //   url: "redis://:<password>@<host>:<port>", // Replace <password>, <host>, and <port> with your Redis Cloud details
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
  console.log('Connected to Redis Cloud');
})();

export default redisClient;
