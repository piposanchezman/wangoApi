import { CollectionRecordModel, CollectionRecord } from "../models/CollectionRecord"

export interface CollectionRecordRepository {
  create: (collectionRecord: any) => Promise<CollectionRecord>
  list: () => Promise<CollectionRecord[]>
  listByUser: (userId: string) => Promise<CollectionRecord[]>
  findById: (collectionRecordId: string) => Promise<CollectionRecord | null>
  geCollectionRecordsByCollectionId: (
    collectionId: string,
    userId: string
  ) => Promise<CollectionRecord[]>

  getLastCollectionRecordByCollectionId: (
    collectionId: string,
    userId: string
  ) => Promise<CollectionRecord>
  getPaginatedCollectionRecordsByCollectionId: (
    page: number,
    limit: number,
    userId: string,
    collectionId: string
  ) => Promise<CollectionRecord[]>
  countRecordsByCollectionId: (collectionId: string, userId: string) => Promise<number>
  update: (
    collectionRecordId: string,
    collectionRecord: CollectionRecord
  ) => Promise<CollectionRecord>
  delete: (collectionRecordId: string) => Promise<CollectionRecord>
  deleteCollectionRecordsByCollectionId: (collectionId: string) => Promise<any>
}
export class CollectionRecordMongoRepository implements CollectionRecordRepository {
  async create(collectionRecord: any): Promise<CollectionRecord> {
    const newCollectionRecord = new CollectionRecordModel({
      ...collectionRecord,
    })
    return await newCollectionRecord.save()
  }
  async list(): Promise<CollectionRecord[]> {
    return CollectionRecordModel.find()
  }
  async countRecordsByCollectionId(collectionId: string, userId: string): Promise<number> {
    return CollectionRecordModel.countDocuments({
      collection_id: collectionId,
      user: userId,
    })
  }
  async getLastCollectionRecordByCollectionId(collectionId: string, userId: string): Promise<any> {
    return CollectionRecordModel.findOne({
      collection_id: collectionId,
      user: userId,
    }).sort({ createdAt: -1 })
  }
  async getPaginatedCollectionRecordsByCollectionId(
    page: number,
    limit: number,
    userId: string,
    collectionId: string
  ): Promise<CollectionRecord[]> {
    return CollectionRecordModel.find({
      collection_id: collectionId,
      user: userId,
    })
      .skip((page - 1) * limit)
      .limit(limit)
  }
  async geCollectionRecordsByCollectionId(
    collectionId: string,
    userId: string
  ): Promise<CollectionRecord[]> {
    return CollectionRecordModel.find({
      collection_id: collectionId,
      user: userId,
    })
  }
  async findById(collectionRecordId: string): Promise<any> {
    return CollectionRecordModel.findById(collectionRecordId)
  }
  async listByUser(userId: string): Promise<CollectionRecord[]> {
    return CollectionRecordModel.find({ user: userId })
  }
  async update(collectionRecordId: string, collectionRecord: CollectionRecord): Promise<any> {
    return CollectionRecordModel.findByIdAndUpdate(
      collectionRecordId,
      { $set: collectionRecord },
      { new: true }
    )
  }
  async delete(collectionRecordId: string): Promise<any> {
    return CollectionRecordModel.findByIdAndDelete(collectionRecordId)
  }
  async deleteCollectionRecordsByCollectionId(collectionId: string): Promise<any> {
    return CollectionRecordModel.deleteMany({ collection_id: collectionId })
  }
}
