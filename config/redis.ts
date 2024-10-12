import { createClient } from "redis";

export class RedisClient {
  private static instance: RedisClient;
  private client: ReturnType<typeof createClient>;

  private constructor() {
    const url = process.env.REDIS_URL || "redis://localhost:6380";
    this.client = createClient({
      url,
    });
    this.client.on("error", (error: any) => {
      console.error("Redis Client Error", error);
      process.exit(1);
    });

    this.client.on("connect", () => {
      console.log("Redis connected to:", url);
    });

    this.startRedis();
  }
  static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }
  private async startRedis() {
    await this.client.connect();
  }
  getClient() {
    return this.client;
  }
}
