import { AnalyticsRepository } from "../Respositories/AnalyticsRepository";
import { ErrorHandling } from "../middleware/ErrorHandling";

export class AnalyticsController {
  private static instance: AnalyticsController;
  private analyticsRepository: AnalyticsRepository;

  constructor(analyticsRepository: AnalyticsRepository) {
    this.analyticsRepository = analyticsRepository;
  }

  async getLotsQuantityByMonth(userId: string): Promise<any> {
    try {
      const response = await this.analyticsRepository.aggregateLotByMonth(userId);
      return {
        status: "success",
        data: response,
        message: "Lots quantity by month fetched successfully",
        code: 200,
      };
    } catch (error: any) {
      return ErrorHandling.handleError(error);
    }
  }

  async getCropsQuantityByMonth(userId: string): Promise<any> {
    try {
      const response = await this.analyticsRepository.aggregateCropByMonth(userId);
      return {
        status: "success",
        data: response,
        message: "Crops quantity by month fetched successfully",
        code: 200,
      };
    } catch (error: any) {
      return ErrorHandling.handleError(error);
    }
  }

  async getDailyPerformanceQuantityByMonth(userId: string): Promise<any> {
    try {
      const response = await this.analyticsRepository.aggregateDailyPerformance(userId);
      return {
        status: "success",
        data: response,
        message: "Daily performance quantity by month fetched successfully",
        code: 200,
      };
    } catch (error: any) {
      return ErrorHandling.handleError(error);
    }
  }
}
