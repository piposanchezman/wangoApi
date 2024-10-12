import { CollectionRepository } from "../Respositories/CollectionRepositorie"
import { ErrorHandling } from "../middleware/ErrorHandling"
import { ApiResponse } from "../interfaces/Api"
import { CollectionCrop } from "../models/CollectionCrop"
import { CollectionRecordController } from "./CollectionRecordController"
import { CropRepository } from "../Respositories/CropRepositorie"
export class CollectionCropController {
  private collectionRepository: CollectionRepository
  private cropRepository: CropRepository
  private collectionRecordController: CollectionRecordController

  constructor(
    collectionRepository: CollectionRepository,
    cropRepository: CropRepository,
    collectionRecordController: CollectionRecordController
  ) {
    this.collectionRepository = collectionRepository
    this.cropRepository = cropRepository
    this.collectionRecordController = collectionRecordController
  }
  public createNewCollection = async (
    data: CollectionCrop,
    userId: string
  ): Promise<ApiResponse> => {
    try {
      const { crop_id, name } = data
      const crop = await this.cropRepository.listById(crop_id)
      if (!crop) {
        return {
          status: "error",
          code: 404,
          message: "The crop does not exist, please provide a valid crop_id",
        }
      }
      const collection = await this.collectionRepository.create({
        crop_id,
        name,
        user: userId,
      })
      return {
        status: "success",
        code: 201,
        data: collection,
        message: "Collection created",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public deleteCollectionById = async (collectionId: string): Promise<ApiResponse> => {
    try {
      // Search if the collection have records and delete them
      const records = await this.collectionRecordController.deleteCollectionRecordsByCollectionId(
        collectionId
      )
      if (records.status === "error") {
        return {
          status: "error",
          code: records.code,
          message: records.message,
        }
      }
      const collection = await this.collectionRepository.delete(collectionId)
      if (!collection) {
        return {
          status: "error",
          code: 404,
          message: "Collection not found",
        }
      }
      return {
        status: "success",
        code: 200,
        data: collection,
        message: "Collection and its records deleted",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  //Search for collections records
  public getPaginatedCollectionsByCropId = async (
    cropId: string,
    page: number,
    limit: number,
    userId: string
  ): Promise<ApiResponse> => {
    try {
      const collections = await this.collectionRepository.getPaginatedCollectionsByCropId(
        cropId,
        page,
        limit,
        userId
      )
      if (!collections) {
        return {
          status: "error",
          code: 404,
          message: "Collections not found",
        }
      }
      const totalCollections = await this.collectionRepository.countCollectionsByCropId(
        cropId,
        userId
      )
      return {
        status: "success",
        code: 200,
        data: {
          collections,
          meta: {
            total_documents: totalCollections,
            total_pages: Math.ceil(totalCollections / limit),
            page,
            limit,
          },
        },
        message: "Collections found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public findCollectionById = async (collectionId: string): Promise<ApiResponse> => {
    try {
      const collection = await this.collectionRepository.listById(collectionId)
      if (!collection) {
        return {
          status: "error",
          code: 404,
          message: "Collection not found",
        }
      }
      return {
        status: "success",
        code: 200,
        data: collection,
        message: "Collection found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public findCollectionsByCropId = async (cropId: string): Promise<ApiResponse> => {
    try {
      const collections = await this.collectionRepository.findCollectionsByCropId(cropId)
      if (collections.length === 0) {
        return {
          status: "success",
          code: 200,
          data: [],
          message: "Collections not found",
        }
      }
      return {
        status: "success",
        code: 200,
        data: collections,
        message: "Collections found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public findLastCollectonByCropId = async (cropId: string): Promise<ApiResponse> => {
    try {
      const collection = await this.collectionRepository.findLastCollectionByCropId(cropId)
      if (!collection) {
        return {
          status: "error",
          code: 404,
          message: "Collection not found",
        }
      }
      return {
        status: "success",
        code: 200,
        data: collection,
        message: "Collection found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public updateCollectionStatus = async (
    collectionId: string,
    data: CollectionCrop
  ): Promise<ApiResponse> => {
    try {
      const { crop_id, status } = data
      const crop = await this.cropRepository.listById(crop_id)
      if (!crop) {
        return {
          status: "error",
          code: 404,
          message: "The crop does not exist, please provide a valid crop_id",
        }
      }
      const collection = await this.collectionRepository.updateCollectionStatus(
        collectionId,
        status
      )
      if (!collection) {
        return {
          status: "error",
          code: 404,
          message: "Collection not found",
        }
      }
      return {
        status: "success",
        code: 200,
        data: collection,
        message: "Collection updated",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
}
