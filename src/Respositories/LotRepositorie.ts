import { Lot } from "../models/Lot"
import LotModel from "../models/Lot"
export interface LotRespositorie {
  createNewLot: (data: Lot, userId: string) => Promise<any>
  countByUserId: (userId: string) => Promise<any>
  deleteLot: (lotId: string) => Promise<any>
  getAllLots: () => Promise<any>
  listPaginatedByUser: (page: number, limit: number, userId: string) => Promise<any>
  getLotInfo: (lotId: string) => Promise<any>
  getLotByUser: (userId: string) => Promise<any>
  getLotById: (lotId: string) => Promise<any>
  updateLotInfo: (lotId: string, data: any) => Promise<any>
}

export class LotMongoRespositorie implements LotRespositorie {
  public async countByUserId(userId: string) {
    return await LotModel.find({ user: userId }).countDocuments()
  }
  public async getAllLots() {
    return await LotModel.find()
  }
  public async getLotInfo(lotId: string) {
    return await LotModel.findOne({ _id: lotId })
  }
  public async listPaginatedByUser(page: number, limit: number, userId: string) {
    return await LotModel.find({ user: userId })
      .skip((page - 1) * limit)
      .limit(limit)
  }
  public async getLotByUser(userId: string) {
    return await LotModel.find({ user: userId })
  }
  public async getLotById(lotId: string) {
    return await LotModel.findOne({ _id: lotId })
  }
  public async updateLotInfo(lotId: string, data: any) {
    return await LotModel.findOneAndUpdate(
      {
        _id: lotId,
      },
      data,
      {
        new: true,
      }
    ).exec()
  }
  public async createNewLot(data: Lot, userId: string) {
    const newLot = new LotModel({
      ...data,
      user: userId,
    })
    return await newLot.save()
  }
  public async deleteLot(lotId: string) {
    return await LotModel.deleteOne({ _id: lotId })
  }
}
