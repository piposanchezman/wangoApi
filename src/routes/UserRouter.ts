import { Request, Response, Router } from "express";
import { UserWangoMongoRespositorie } from "../Respositories/UserWangoRespositorie";
import { UserController } from "../controllers/UserController";
import { AnalyticsRouter } from "./AnalyticsRouter";
import { RedisClient } from "../../config/redis";

export class UserRouter {
  private static instance: UserRouter;
  private userController: UserController;
  private router: Router;
  private redisClient: RedisClient;

  private constructor(userController: UserController, redisClient: RedisClient) {
    this.router = Router();
    this.userController = userController;
    this.router.get("/info", this.getUserInfo);
    this.router.put("/info/update", this.updateUser);
    this.router.use("/analytics", AnalyticsRouter.getRouter());
    this.redisClient = redisClient;
  }
  // private cacheMiddlare = async (req: Request, res: Response, next: any) => {
  //   if (!req.user) {
  //     return res.status(403).send({
  //       message: "unauthorized",
  //     })
  //   }
  //   const userId = req.user.sub
  //   // DarkCheddar was here
  //   const redisClient = this.redisClient.getClient()
  //   const redisKey = `user:${userId}`
  //   const cachedData = await redisClient.hGetAll(redisKey)
  //   if (cachedData.userData) {
  //     return res.status(200).send({
  //       status: "success",
  //       data: JSON.parse(cachedData.userData),
  //       message: "user info fetched from cache",
  //     })
  //   }
  //   next()
  // }
  static getRouter(): Router {
    if (!UserRouter.instance) {
      const userWangoRepositorie = new UserWangoMongoRespositorie();
      const userController = new UserController(userWangoRepositorie);
      const redisClient = RedisClient.getInstance();
      UserRouter.instance = new UserRouter(userController, redisClient);
    }
    return UserRouter.instance.router;
  }

  private getUserInfo = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        });
      }
      const userId = req.user.sub;
      const userResponse = await this.userController.getUserInfo(userId);
      if (userResponse.code === 404) {
        const migrationResponse: any = await this.userController.migrateUser(userId);
        if (migrationResponse.success) {
          return res.status(migrationResponse.code).send({
            status: "success",
            data: migrationResponse.data,
            message: migrationResponse.message,
          });
        } else {
          return res.status(500).send(migrationResponse.data);
        }
      }

      // Save user info in cache
      // const redisKey = `user:${userId}`
      // const redisClient = this.redisClient.getClient()
      // await redisClient.hSet(redisKey, "userData", JSON.stringify(userResponse.data))
      // Set expiration time to 1 hour (3600 seconds)
      // await redisClient.expire(redisKey, 3600)
      return res.status(userResponse.code).send({
        status: "success",
        data: userResponse.data,
        message: userResponse.message,
      });
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  };
  private updateUser = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        });
      }
      const userId = req.user.sub;
      const data = req.body;
      const response = await this.userController.updateUserInfo(userId, data);
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        });
      }
      return res.status(response.code).send({
        data: response.data,
        status: "success",
        message: response.message,
      });
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  };
}
