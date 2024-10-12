import dotenv from "dotenv";

export class EnvLoader {
  private static instance: EnvLoader;
  private constructor() {}
  public static getInstance(): EnvLoader {
    if (!EnvLoader.instance) {
      let path: string;
      switch (process.env.NODE_ENV?.replace(/\s/g, "")) {
        case "test":
          path = ".env.test";
          break;
        case "staging":
          path = ".env.staging";
          break;
        case "production":
          path = ".env.production";
          break;
        default:
          path = ".env.development";
      }
      dotenv.config({ path });
      console.log(`Environment loaded from ${path}`);
      EnvLoader.instance = new EnvLoader();
    }
    return EnvLoader.instance;
  }
}
