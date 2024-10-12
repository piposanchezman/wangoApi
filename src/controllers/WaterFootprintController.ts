import { CropRepository } from "../Respositories/CropRepositorie"
import { CollectionRecordRepository } from "../Respositories/CollectionRecordRepositorie"
import { UserRespositorie } from "../Respositories/UserWangoRespositorie"
import { WaterFootprintRepositorie } from "../Respositories/WaterFootprintRepositorie"
import { ChatGptService } from "../services/IA"
import { ErrorHandling } from "../middleware/ErrorHandling"
import { ApiResponse } from "../interfaces/Api"

export class WaterFootprintController {
  private repository: WaterFootprintRepositorie
  private collectionRecordRepository: CollectionRecordRepository
  private cropRepository: CropRepository
  private userRepository: UserRespositorie
  constructor(
    waterFootprintRepositorie: WaterFootprintRepositorie,
    collectionRecordRepository: CollectionRecordRepository,
    cropRepository: CropRepository,
    userRepository: UserRespositorie
  ) {
    this.repository = waterFootprintRepositorie
    this.collectionRecordRepository = collectionRecordRepository
    this.userRepository = userRepository
    this.cropRepository = cropRepository
  }
  getWaterFootprintByCollectionId = async (collectionId: string): Promise<ApiResponse> => {
    try {
      const waterFootprint = await this.repository.getWaterFootprintByCollectionId(collectionId)
      if (!waterFootprint) {
        return {
          code: 404,
          status: "error",
          message: "Water footprint not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: waterFootprint,
        message: "Water footprint found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  createWaterFootprint = async (waterFootprint: any, userId: string): Promise<ApiResponse> => {
    try {
      const greenWaterFootprint = await this.calculateGreenWaterFootprint(
        waterFootprint.collection_id,
        waterFootprint.crop_id,
        userId
      )
      if (greenWaterFootprint.status === "error") {
        return {
          code: 500,
          status: "error",
          message: greenWaterFootprint.message,
        }
      }
      const blueWaterFootprint = await this.calculateBlueWaterFootprint(
        waterFootprint.collection_id,
        waterFootprint.crop_id,
        userId
      )
      if (blueWaterFootprint.status === "error") {
        return {
          code: 500,
          status: "error",
          message: blueWaterFootprint.message,
        }
      }
      const greyWaterFootprint = await this.calculateGreyWaterFootprint(
        waterFootprint.collection_id,
        userId
      )
      if (greyWaterFootprint.status === "error") {
        return {
          code: 500,
          status: "error",
          message: greyWaterFootprint.message,
        }
      }
      const totalWaterFootprint =
        greenWaterFootprint.data + blueWaterFootprint.data + greyWaterFootprint.data
      const createdWaterFootprint = await this.repository.createWaterFootprint(
        {
          ...waterFootprint,
          green_component: greenWaterFootprint.data.toFixed(2),
          blue_component: blueWaterFootprint.data.toFixed(2),
          grey_component: greyWaterFootprint.data.toFixed(2),
          total: parseFloat(totalWaterFootprint).toFixed(2),
        },
        userId
      )
      return {
        code: 201,
        status: "success",
        data: createdWaterFootprint,
        message: "Water footprint created",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  getWaterFootprintByCropIdAndCollectionId = async (
    collectionId: string,
    cropId: string,
    userId: string
  ): Promise<ApiResponse> => {
    try {
      const waterFootprint = await this.repository.getWaterFootprintByCropIdAndCollectionId(
        collectionId,
        cropId,
        userId
      )
      if (!waterFootprint) {
        return {
          code: 404,
          status: "error",
          message: "Water footprint not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: waterFootprint,
        message: "Water footprint found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  getWaterFootprintSuggestion = async (
    collectionId: string,
    cropId: string,
    userId: string
  ): Promise<ApiResponse> => {
    try {
      const waterFootprint = await this.repository.getWaterFootprintByCropIdAndCollectionId(
        collectionId,
        cropId,
        userId
      )
      if (!waterFootprint) {
        return {
          code: 404,
          status: "error",
          message: "Water footprint not found",
        }
      }
      if (waterFootprint.ia_suggestion !== "") {
        return {
          code: 200,
          status: "success",
          data: waterFootprint.ia_suggestion,
          message: "Water footprint suggestion found",
        }
      }
      const reponse = await ChatGptService.getResponse(
        `Puedes sugerirme como reducir la huella hidrica para el cultivo de mango Tommy Atkins, el componente verde es ${waterFootprint.green_component}, el componente azul es ${waterFootprint.blue_component} y el componente gris es ${waterFootprint.grey_component}. El total es ${waterFootprint.total} en metros cubicos por año."`
      )
      if (reponse.status === "error") {
        return {
          code: 500,
          status: "error",
          message: reponse.message,
        }
      }
      const updatedWaterFootprint = await this.repository.updateWaterFootprintById(
        waterFootprint._id,
        {
          ia_suggestion: reponse.data,
        },
        userId
      )
      return {
        code: 200,
        status: "success",
        data: updatedWaterFootprint?.ia_suggestion,
        message: "Water footprint found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  private calculateGreenWaterFootprint = async (
    collectionId: string,
    cropId: string,
    userId: string
  ): Promise<ApiResponse> => {
    try {
      let greenWaterFootprint = 0
      let eto = 0
      const crop = await this.cropRepository.listById(cropId)
      if (!crop) {
        return {
          code: 404,
          status: "error",
          message: "Crop not found",
        }
      }
      const { area } = crop
      const collectionRecords =
        await this.collectionRecordRepository.geCollectionRecordsByCollectionId(
          collectionId,
          userId
        )
      for (const record of collectionRecords) {
        eto += record.reference_evotranspiration
      }
      greenWaterFootprint = ((eto * 365) / collectionRecords.length) * (1.75 * 0.001 * area * 10000)
      return {
        code: 200,
        status: "success",
        data: greenWaterFootprint,
        message: "Green water footprint calculated",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  private calculateBlueWaterFootprint = async (
    collectionId: string,
    cropId: string,
    userId: string
  ): Promise<ApiResponse> => {
    try {
      let blueWaterFootprint = 0
      let lr = 0
      let etc = 0
      const crop = await this.cropRepository.listById(cropId)
      if (!crop) {
        return {
          code: 404,
          status: "error",
          message: "Crop not found",
        }
      }
      const { area } = crop
      const collectionRecords =
        await this.collectionRecordRepository.geCollectionRecordsByCollectionId(
          collectionId,
          userId
        )
      for (const record of collectionRecords) {
        etc += record.actual_crop_evapotranspiration
      }
      etc = (etc * 365) / collectionRecords.length
      lr = etc / 1.75
      blueWaterFootprint += lr * 0.001 * area * 10000
      return {
        code: 200,
        status: "success",
        data: blueWaterFootprint,
        message: "Blue water footprint calculated",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  private calculateGreyWaterFootprint = async (
    collectionId: string,
    userId: string
  ): Promise<ApiResponse> => {
    try {
      let greyWaterFootprint = 0
      let ar = 0
      const user = await this.userRepository.getUserInfo(userId)
      if (!user) {
        return {
          code: 404,
          status: "error",
          message: "User not found",
        }
      }
      const { maximum_quantity, natural_amount_chemical } = user.environment_variables
      const collectionRecords =
        await this.collectionRecordRepository.geCollectionRecordsByCollectionId(
          collectionId,
          userId
        )
      for (const record of collectionRecords) {
        ar += record.amount_chemicals_used
      }
      ar = (ar * 365) / collectionRecords.length
      greyWaterFootprint += ar * (1 / ((maximum_quantity - natural_amount_chemical) / 1000) / 0.09)

      return {
        code: 200,
        status: "success",
        data: greyWaterFootprint,
        message: "Grey water footprint calculated",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
}
