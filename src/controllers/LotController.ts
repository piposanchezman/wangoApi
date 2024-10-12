import { LotRespositorie } from "../Respositories/LotRepositorie"
import { CropController } from "./CropController"
import { ErrorHandling } from "../middleware/ErrorHandling"
import { ApiResponse } from "../interfaces/Api"
export class LotController {
  private lotRespositorie: LotRespositorie
  private cropController: CropController
  constructor(lotRespositorie: LotRespositorie, cropController: CropController) {
    this.lotRespositorie = lotRespositorie
    this.cropController = cropController
  }
  public getAllLots = async (): Promise<ApiResponse> => {
    try {
      const lots = await this.lotRespositorie.getAllLots()
      if (!lots) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Lots not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: lots,
        message: "Lots found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public getLotByUser = async (userId: string): Promise<ApiResponse> => {
    try {
      const lots = await this.lotRespositorie.getLotByUser(userId)
      if (!lots) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Lots not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: lots,
        message: "Lots found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public getLotById = async (lotId: string): Promise<ApiResponse> => {
    try {
      const lot = await this.lotRespositorie.getLotById(lotId)
      if (!lot) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Lot not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: lot,
        message: "Lot found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public getLotInfo = async (lotId: string): Promise<ApiResponse> => {
    try {
      const lot = await this.lotRespositorie.getLotInfo(lotId)
      if (!lot) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Lot not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: lot,
        message: "Lot found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public getLotsPaginated = async (
    page: number,
    limit: number,
    userId: string
  ): Promise<ApiResponse> => {
    try {
      const lots = await this.lotRespositorie.listPaginatedByUser(page, limit, userId)
      if (!lots) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Lots not found",
        }
      }
      const totalDocuments = await this.lotRespositorie.countByUserId(userId)
      return {
        code: 200,
        status: "success",
        data: {
          lots,
          meta: {
            total_documents: totalDocuments,
            total_pages: Math.ceil(totalDocuments / limit),
            page,
            limit,
          },
        },
        message: "Lots found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public updateLotInfo = async (lotId: string, data: any): Promise<ApiResponse> => {
    try {
      //verify if the new capacity is greater than the available capacity
      if (data.capacity) {
        const lot = await this.lotRespositorie.getLotInfo(lotId)
        if (data.capacity < lot.capacity_in_use) {
          return {
            code: 400,
            status: "error",
            data: null,
            message: "The new capacity must be greater than the available capacity",
          }
        }
      }
      const updatedLot = await this.lotRespositorie.updateLotInfo(lotId, data)
      if (!updatedLot) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "Lot not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: updatedLot,
        message: "lot updated",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public createNewLot = async (data: any, userId: string): Promise<ApiResponse> => {
    try {
      const newLot = await this.lotRespositorie.createNewLot(data, userId)
      if (!newLot) {
        return {
          code: 500,
          status: "error",
          data: null,
          message: "Error creating lot",
        }
      }
      return {
        code: 200,
        status: "success",
        data: newLot,
        message: "Lot created",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public deleteLot = async (lotId: string): Promise<ApiResponse> => {
    try {
      const response = await this.getLotById(lotId)
      if (response.status === "error") {
        return {
          code: response.code,
          status: "error",
          data: null,
          message: response.message,
        }
      }
      const crops = await this.cropController.getCropsByLotId(lotId)
      if (crops.status === "success" && crops.data.length > 0) {
        for (const crop of crops.data) {
          await this.cropController.deleteCrop(crop, crop._id)
        }
      }
      const deletedLot = await this.lotRespositorie.deleteLot(lotId)
      return {
        code: 200,
        status: "success",
        data: deletedLot,
        message: "Lot deleted",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
}
