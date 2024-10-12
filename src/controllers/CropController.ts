import { CropRepository } from "../Respositories/CropRepositorie"
import { ErrorHandling } from "../middleware/ErrorHandling"
import { ApiResponse } from "../interfaces/Api"
import { Crop } from "../models/Crop"
import { LotRespositorie } from "../Respositories/LotRepositorie"
import { CollectionCropController } from "./CollectionCropController"
import { CollectionCrop } from "../models/CollectionCrop"
export class CropController {
  private cropRepository: CropRepository
  private lotRepository: LotRespositorie
  private collectionController: CollectionCropController
  constructor(
    cropRepository: CropRepository,
    lotRepository: LotRespositorie,
    collectionController: CollectionCropController
  ) {
    this.cropRepository = cropRepository
    this.lotRepository = lotRepository
    this.collectionController = collectionController
  }
  public createNewCrop = async (data: Crop, userId: string): Promise<ApiResponse> => {
    try {
      // First, check if the lot exists
      const lot = await this.lotRepository.getLotById(data.lot_id)
      if (!lot) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Lot not found",
        }
      }
      if (data.area <= 0) {
        return {
          code: 400,
          status: "error",
          data: null,
          message: "Area must be greater than 0",
        }
      }
      if (data.area > lot.available_capacity) {
        return {
          code: 400,
          status: "error",
          data: null,
          message: "Area greater than available capacity",
        }
      }
      const crop = await this.cropRepository.create(data, userId)
      if (!crop) {
        return {
          code: 500,
          status: "error",
          data: null,
          message: "Error creating crop",
        }
      }
      // update lot info
      const capacityUpdated =
        lot.capacity_in_use === 0 ? data.area : lot.capacity_in_use + data.area
      await this.lotRepository.updateLotInfo(data.lot_id, {
        available_capacity: lot.capacity - capacityUpdated,
        capacity_in_use: capacityUpdated,
      })
      return {
        code: 200,
        status: "success",
        data: crop,
        message: "Crop created",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public deleteCrop = async (data: Crop, cropId: string): Promise<ApiResponse> => {
    try {
      const LotId = data.lot_id
      // First, check if the crop exists
      const crop = await this.cropRepository.listById(cropId)
      if (!crop) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Crop not found",
        }
      }
      const lot = await this.lotRepository.getLotById(LotId)
      if (!lot) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Lot not found",
        }
      }
      // Delete all collections related to the crop
      const collections = await this.collectionController.findCollectionsByCropId(cropId)
      if (collections.data && collections.data.length > 0) {
        collections.data.forEach(async (collection: CollectionCrop) => {
          await this.collectionController.deleteCollectionById(collection._id)
        })
      }
      // update lot info
      const capacityUpdated = lot.capacity_in_use - crop.area
      await this.lotRepository.updateLotInfo(LotId, {
        available_capacity: lot.capacity - capacityUpdated,
        capacity_in_use: capacityUpdated,
      })
      const deletedCrop = await this.cropRepository.delete(cropId)

      return {
        code: 200,
        status: "success",
        data: deletedCrop,
        message: "Crop and related collections deleted",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public getAllCrops = async (): Promise<ApiResponse> => {
    try {
      const crops = await this.cropRepository.list()
      if (!crops) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Crops not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: crops,
        message: "Crops found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public getCropsPaginated = async (
    page: number,
    limit: number,
    userId: string,
    lotId: string
  ): Promise<ApiResponse> => {
    try {
      const crops = await this.cropRepository.listPaginatedByLotId(page, limit, userId, lotId)
      if (!crops) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Crops not found",
        }
      }
      const totalDocuments = await this.cropRepository.countByLotId(lotId)
      return {
        code: 200,
        status: "success",
        data: {
          crops,
          meta: {
            total_documents: totalDocuments,
            total_pages: Math.ceil(totalDocuments / limit),
            page,
            limit,
          },
        },
        message: "Crops found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public getCropsByUser = async (userId: string): Promise<ApiResponse> => {
    try {
      const lots = await this.cropRepository.listByUser(userId)
      if (!lots) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Crops not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: lots,
        message: "Crops found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public getCropsByLotId = async (lotId: string): Promise<ApiResponse> => {
    try {
      const crops = await this.cropRepository.findCropsByLotId(lotId)
      if (!crops) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Crops not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: crops,
        message: "Crops found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public getCropInfo = async (cropId: string): Promise<ApiResponse> => {
    try {
      const crop = await this.cropRepository.listById(cropId)
      if (!crop) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Crop not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: crop,
        message: "Crop found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public updateCropInfo = async (cropId: string, data: any): Promise<ApiResponse> => {
    try {
      const updatedLot = await this.cropRepository.update(cropId, data)
      if (!updatedLot) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Crop not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: updatedLot,
        message: "Crop updated",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
}
