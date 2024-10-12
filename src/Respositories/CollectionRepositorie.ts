import { CollectionCrop, CollectionCropModel } from "../models/CollectionCrop"

export interface CollectionRepository {
  create: (collectionRecord: any) => Promise<CollectionCrop>
  list: () => Promise<CollectionCrop[]>
  listByUser: (userId: string) => Promise<CollectionCrop[]>
  listById: (collectionId: string) => Promise<CollectionCrop>
  findCollectionById: (collectionId: string) => Promise<CollectionCrop | null>
  findCollectionsByCropId: (cropId: string) => Promise<CollectionCrop[]>
  findLastCollectionByCropId: (cropId: string) => Promise<CollectionCrop[]>
  getPaginatedCollectionsByCropId: (
    cropId: string,
    page: number,
    limit: number,
    userId: string
  ) => Promise<CollectionCrop[]>
  countCollectionsByCropId: (collectionId: string, userId: string) => Promise<number>
  update: (collectionId: string, collectionRecord: CollectionCrop) => Promise<CollectionCrop>
  updateCollectionStatus: (collectionId: string, status: string) => Promise<CollectionCrop>
  delete: (collectionId: string) => Promise<CollectionCrop>
  deleteCollectionsByCropId: (cropId: string) => Promise<any>
}
export class CollectionMongoRepository implements CollectionRepository {
  async create(collectionRecord: any): Promise<CollectionCrop> {
    const newCollection = new CollectionCropModel({
      ...collectionRecord,
    })
    return await newCollection.save()
  }
  async deleteCollectionsByCropId(cropId: string): Promise<any> {
    return CollectionCropModel.deleteMany({ crop_id: cropId })
  }
  async findCollectionById(collectionId: string): Promise<CollectionCrop | null> {
    return CollectionCropModel.findById(collectionId)
  }
  async findCollectionsByCropId(cropId: string): Promise<CollectionCrop[]> {
    return CollectionCropModel.find({ crop_id: cropId })
  }
  async findLastCollectionByCropId(cropId: string): Promise<any> {
    return CollectionCropModel.findOne({ crop_id: cropId }).sort({ createdAt: -1 })
  }
  async list(): Promise<CollectionCrop[]> {
    return CollectionCropModel.find()
  }
  async countByUserId(userId: string): Promise<number> {
    return CollectionCropModel.countDocuments({
      user: userId,
    })
  }
  async countCollectionsByCropId(cropId: string, userId: string): Promise<number> {
    return CollectionCropModel.countDocuments({
      crop_id: cropId,
      user: userId,
    })
  }
  async getPaginatedCollectionsByCropId(
    cropId: string,
    page: number,
    limit: number,
    userId: string
  ): Promise<any> {
    return CollectionCropModel.find({
      crop_id: cropId,
      user: userId,
    })
      .skip((page - 1) * limit)
      .limit(limit)
  }
  async listById(collectionId: string): Promise<any> {
    return CollectionCropModel.findById(collectionId)
  }
  async listByUser(userId: string): Promise<CollectionCrop[]> {
    return CollectionCropModel.find({ user: userId })
  }
  async update(collectionId: string, collectionCrop: CollectionCrop): Promise<any> {
    return CollectionCropModel.findByIdAndUpdate(collectionId, collectionCrop)
  }
  async updateCollectionStatus(collectionId: string, status: string): Promise<any> {
    return CollectionCropModel.findByIdAndUpdate(
      collectionId,
      { status: status, final_date: new Date() },
      { new: true }
    )
  }
  async delete(collectionId: string): Promise<any> {
    return CollectionCropModel.findByIdAndDelete(collectionId)
  }
}
