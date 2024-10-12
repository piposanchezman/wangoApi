import { CollectionRecordRepository } from "../Respositories/CollectionRecordRepositorie"
import { CollectionRecord } from "../models/CollectionRecord"
import { CollectionRepository } from "../Respositories/CollectionRepositorie"
import { ErrorHandling } from "../middleware/ErrorHandling"
import { ApiResponse } from "../interfaces/Api"

export class CollectionRecordController {
  private collectionRecordRepository: CollectionRecordRepository
  private collectionRepository: CollectionRepository
  constructor(
    collectionRecordRepository: CollectionRecordRepository,
    collectionRepository: CollectionRepository
  ) {
    this.collectionRecordRepository = collectionRecordRepository
    this.collectionRepository = collectionRepository
  }
  public createNewCollectionRecord = async (
    data: CollectionRecord,
    userId: string
  ): Promise<ApiResponse> => {
    try {
      const {
        amount_chemicals_used,
        actual_crop_evapotranspiration,
        collection_id,
        daily_performance,
        name,
        reference_evotranspiration,
      } = data
      // check if collection exists
      const collection = await this.collectionRepository.findCollectionById(collection_id)
      if (!collection) {
        return {
          status: "error",
          code: 404,
          message: "Collection not found",
        }
      }
      const lastRecord =
        await this.collectionRecordRepository.getLastCollectionRecordByCollectionId(
          collection_id,
          userId
        )
      if (lastRecord) {
        const lastRecordDate = new Date(lastRecord.createdAt)
        const currentDate = new Date()
        const difference = currentDate.getTime() - lastRecordDate.getTime()
        const days = difference / (1000 * 3600 * 24)
        if (days < 1) {
          return {
            status: "error",
            code: 400,
            message: "You can only create a record once a day",
          }
        }
      }
      const collectionRecord = await this.collectionRecordRepository.create({
        amount_chemicals_used,
        actual_crop_evapotranspiration,
        collection_id,
        daily_performance,
        name,
        user: userId,
        reference_evotranspiration,
      })
      return {
        status: "success",
        code: 201,
        data: collectionRecord,
        message: "Collection record created",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  // public getLastCollectionRecord = async (userId: string): Promise<ApiResponse> => {
  //   try {
  //     const latestRecord = await this.collectionRecordRepository.getLastRecordByCollectionId(userId)
  //     if (!latestRecord) {
  //       return {
  //         status: "error",
  //         code: 404,
  //         message: "No record found",
  //       }
  //     }
  //     return {
  //       status: "success",
  //       code: 200,
  //       data: latestRecord,
  //       message: "Latest record found",
  //     }
  //   } catch (error: any) {
  //     return ErrorHandling.handleError(error)
  //   }
  // }
  public deleteCollectionRecordById = async (collectionRecordId: string): Promise<ApiResponse> => {
    try {
      const collectionRecord = await this.collectionRecordRepository.delete(collectionRecordId)
      if (!collectionRecord) {
        return {
          status: "error",
          code: 404,
          message: "Collection record not found",
        }
      }
      return {
        status: "success",
        code: 200,
        data: collectionRecord,
        message: "Collection record deleted",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public deleteCollectionRecordsByCollectionId = async (
    collectionId: string
  ): Promise<ApiResponse> => {
    try {
      const collectionRecords =
        await this.collectionRecordRepository.deleteCollectionRecordsByCollectionId(collectionId)
      if (collectionRecords.deletedCount === 0) {
        return {
          status: "success",
          code: 200,
          message: "No collection records found to delete",
        }
      }
      return {
        status: "success",
        code: 200,
        data: collectionRecords,
        message: "Collection records deleted",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public getPaginatedCollectionRecords = async (
    page: number,
    limit: number,
    userId: string,
    collectionId: string
  ): Promise<ApiResponse> => {
    try {
      const collectionRecords =
        await this.collectionRecordRepository.getPaginatedCollectionRecordsByCollectionId(
          page,
          limit,
          userId,
          collectionId
        )
      if (!collectionRecords) {
        return {
          status: "error",
          code: 404,
          data: [],
          message: "No records found",
        }
      }
      const totalDocuments = await this.collectionRecordRepository.countRecordsByCollectionId(
        collectionId,
        userId
      )
      return {
        status: "success",
        code: 200,
        data: {
          collectionRecords,
          meta: {
            total_documents: totalDocuments,
            total_pages: Math.ceil(totalDocuments / limit),
            page,
            limit,
          },
        },
        message: "Records found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public getCollectionRecordById = async (collectionRecordId: string): Promise<ApiResponse> => {
    try {
      const collectionRecord = await this.collectionRecordRepository.findById(collectionRecordId)
      if (!collectionRecord) {
        return {
          status: "error",
          code: 404,
          message: "Collection record not found",
        }
      }
      return {
        status: "success",
        code: 200,
        data: collectionRecord,
        message: "Collection record found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public updateCollectionRecordById = async (
    collectionRecordId: string,
    data: CollectionRecord
  ): Promise<ApiResponse> => {
    try {
      const collectionRecord = await this.collectionRecordRepository.update(
        collectionRecordId,
        data
      )
      if (!collectionRecord) {
        return {
          status: "error",
          code: 404,
          message: "Collection record not found",
        }
      }
      return {
        status: "success",
        code: 200,
        data: collectionRecord,
        message: "Collection record updated",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
}
