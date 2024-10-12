import LotModel from "../models/Lot";
import CropModel from "../models/Crop";
import { CollectionRecordModel } from "../models/CollectionRecord";

export interface AnalyticsRepository {
  aggregateLotByMonth(userId: string): Promise<any>;
  aggregateCropByMonth(userId: string): Promise<any>;
  aggregateDailyPerformance(userId: string): Promise<any>;
}

export class AnalyticsMongoRepository implements AnalyticsRepository {
  async aggregateLotByMonth(userId: string): Promise<any> {
    const [response] = await LotModel.aggregate([
      {
        $match: {
          user: userId,
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    return response ? response : { count: 0 };
  }

  async aggregateCropByMonth(userId: string): Promise<any> {
    const [response] = await CropModel.aggregate([
      {
        $match: {
          user: userId,
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    return response ? response : { count: 0 };
  }

  async aggregateDailyPerformance(userId: string): Promise<any> {
    const [response] = await CollectionRecordModel.aggregate([
      {
        $match: {
          user: userId,
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalDailyPerformance: { $sum: "$daily_performance" },
          count: { $sum: 1 },
        },
      },
    ]);
    return response ? response : { totalDailyPerformance: 0, count: 0 };
  }
}
