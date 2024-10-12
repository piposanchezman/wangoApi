import { Crop } from "../models/Crop"
import CropModel from "../models/Crop"
export interface CropRepository {
  create: (crop: Crop, userId: string) => Promise<Crop>
  list: () => Promise<Crop[]>
  listByUser: (userId: string) => Promise<Crop[]>
  listById: (cropId: string) => Promise<Crop>
  findCropsByLotId: (lotId: string) => Promise<Crop[]>
  countByUserId: (userId: string) => Promise<number>
  countByLotId: (lotId: string) => Promise<number>
  listPaginatedByLotId: (
    page: number,
    limit: number,
    userId: string,
    lotId: string
  ) => Promise<Crop[]>
  update: (cropId: string, crop: Crop) => Promise<Crop>
  delete: (cropId: string) => Promise<Crop>
}

export class CropMongoRepository implements CropRepository {
  async create(crop: Crop, userId: string): Promise<Crop> {
    const newCrop = new CropModel({
      ...crop,
      user: userId,
    })
    return await newCrop.save()
  }
  async list(): Promise<Crop[]> {
    return CropModel.find()
  }
  async listPaginatedByLotId(
    page: number,
    limit: number,
    userId: string,
    lotId: string
  ): Promise<Crop[]> {
    return CropModel.find({
      user: userId,
      lot_id: lotId,
    })
      .skip((page - 1) * limit)
      .limit(limit)
  }
  async countByUserId(userId: string): Promise<number> {
    return CropModel.countDocuments({
      user: userId,
    })
  }
  async countByLotId(lotId: string): Promise<number> {
    return CropModel.countDocuments({
      lot_id: lotId,
    })
  }
  async listById(cropId: string): Promise<any> {
    return CropModel.findById(cropId)
  }
  async listByUser(userId: string): Promise<Crop[]> {
    return CropModel.find({ user: userId })
  }
  async findCropsByLotId(lotId: string): Promise<Crop[]> {
    return CropModel.find({ lot_id: lotId })
  }
  async update(cropId: String, crop: Crop): Promise<any> {
    return CropModel.findByIdAndUpdate(
      {
        _id: cropId,
      },
      crop,
      { new: true }
    ).exec()
  }
  async delete(cropId: string): Promise<any> {
    return CropModel.findByIdAndDelete({
      _id: cropId,
    }).exec()
  }
}
