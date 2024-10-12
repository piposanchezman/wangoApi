import { Router, Request, Response } from "express";
import { AnalyticsController } from "../controllers/AnalyticsController";
import { AnalyticsMongoRepository } from "../Respositories/AnalyticsRepository";
export class AnalyticsRouter {
  private static instance: AnalyticsRouter;
  private router: Router;
  private analyticsController: AnalyticsController;

  private constructor(analyticsController: AnalyticsController) {
    this.router = Router();
    this.router.get("/lots/quantity/by-month", this.getLotsQuantityByMonth);
    this.router.get("/crops/quantity/by-month", this.getCropsQuantityByMonth);
    this.router.get(
      "/collections/daily-performance/quantity/by-month",
      this.getDailyPerformanceQuantityByMonth
    );
    this.analyticsController = analyticsController;
  }

  static getRouter(): Router {
    if (!AnalyticsRouter.instance) {
      const analyticsRepository = new AnalyticsMongoRepository();
      const analyticsController = new AnalyticsController(analyticsRepository);
      AnalyticsRouter.instance = new AnalyticsRouter(analyticsController);
    }
    return AnalyticsRouter.instance.router;
  }

  private getLotsQuantityByMonth = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        });
      }
      const userId = req.user.sub;
      const response = await this.analyticsController.getLotsQuantityByMonth(userId);
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        });
      }
      return res.status(response.code).send({
        status: response.status,
        data: response.data,
        message: response.message,
      });
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  };

  private getCropsQuantityByMonth = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        });
      }
      const userId = req.user.sub;
      const response = await this.analyticsController.getCropsQuantityByMonth(userId);
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        });
      }
      return res.status(response.code).send({
        status: response.status,
        data: response.data,
        message: response.message,
      });
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  };

  private getDailyPerformanceQuantityByMonth = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        });
      }
      const userId = req.user.sub;
      const response = await this.analyticsController.getDailyPerformanceQuantityByMonth(userId);
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        });
      }
      return res.status(response.code).send({
        status: response.status,
        data: response.data,
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
