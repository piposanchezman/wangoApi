import { WaterFootprint } from "../models/WaterFootprint"
import WaterFootprintModel from "../models/WaterFootprint"

export interface WaterFootprintRepositorie {
  getWaterFootprintByCollectionId(collectionId: string): Promise<WaterFootprint | null>
  getWaterFootprintByCropIdAndCollectionId(
    collectionId: string,
    cropId: string,
    userId: string
  ): Promise<WaterFootprint | null>
  createWaterFootprint(waterFootprint: WaterFootprint, userId: string): Promise<WaterFootprint>
  updateWaterFootprintById(
    waterFootprintId: string,
    data: any,
    userId: string
  ): Promise<WaterFootprint | null>
}

export class WaterFootprintMongoRepositorie implements WaterFootprintRepositorie {
  async getWaterFootprintByCollectionId(collectionId: string): Promise<WaterFootprint | null> {
    return await WaterFootprintModel.findOne({ collectionId: collectionId }).exec()
  }
  async createWaterFootprint(
    waterFootprint: WaterFootprint,
    userId: string
  ): Promise<WaterFootprint> {
    const newWaterFootprint = new WaterFootprintModel({
      ...waterFootprint,
      user: userId,
    })
    return await newWaterFootprint.save()
  }
  async getWaterFootprintByCropIdAndCollectionId(
    collectionId: string,
    cropId: string,
    userId: string
  ): Promise<WaterFootprint | null> {
    return await WaterFootprintModel.findOne({
      collection_id: collectionId,
      crop_id: cropId,
      user: userId,
    }).exec()
  }
  async updateWaterFootprintById(
    waterFootprintId: string,
    data: any,
    userId: string
  ): Promise<WaterFootprint | null> {
    return await WaterFootprintModel.findOneAndUpdate(
      {
        _id: waterFootprintId,
      },
      {
        ...data,
        user: userId,
      },
      {
        new: true,
      }
    )
  }
}
