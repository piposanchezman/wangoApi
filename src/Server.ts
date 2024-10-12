import { App } from "./App";
import { EnvLoader } from "./utils/EnvLoader";
import { Database } from "../config/db";
import { RedisClient } from "../config/redis";

export class Server {
  private static instance: Server;
  private constructor() {
    EnvLoader.getInstance();
    RedisClient.getInstance();
    Database.getInstance();
    this.startServer();
  }

  static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }
  private startServer() {
    App.getInstance().listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  }
}
